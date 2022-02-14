import { withParser } from 'stream-json/streamers/StreamArray';
import { Readable } from 'stream-json/Parser';
import { MerchantSales } from '../models/merchantSales';
import { pipeline } from 'stream';
import { promisify } from 'util';

const jsonArrayStream = withParser();
const asyncPipeline = promisify(pipeline);

export async function arrayStreamTest(inputArrayString: string, merchantType?: string) {
    const merchantSales: Map<string, MerchantSales> = new Map();
    let numTransactions: number = 0;

    const readable = Readable.from(inputArrayString);
    jsonArrayStream.on('data', (data) => {
        numTransactions += 1;

        // Default will NOT compare merchantType when not provided
        let matchMerchantType = true;
        if (merchantType) {
            matchMerchantType = data.value.merchantType === merchantType;
        }

        if (matchMerchantType) {
            const existingMerchantSale = merchantSales.get(data.value.merchantId);
            if (existingMerchantSale) {
                // Modify exisiting merchant in the array (merchantSales)
                existingMerchantSale.addTransaction(data.value);
                merchantSales.set(data.value.merchantId, existingMerchantSale)
            } else {
                // Add new merchant to the array (merchantSales)
                const newMerchant = new MerchantSales(data.value.merchantId, data.value.merchantType);
                newMerchant.addTransaction(data.value);
                merchantSales.set(data.value.merchantId, newMerchant)
            }
        }
    })
        .on('end', () => {
            console.log(`Completed scanning ${numTransactions} transactions`);
        })

    await asyncPipeline(readable, jsonArrayStream);
    return Array.from(merchantSales.values()).map((merchant) => merchant.calculateStatistics());
    // return merchantSales.map((merchant) => merchant.calculateStatistics());
}
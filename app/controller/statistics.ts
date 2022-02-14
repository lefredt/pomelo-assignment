import { withParser } from 'stream-json/streamers/StreamArray';
import { Readable } from 'stream-json/Parser';
import { MerchantSales } from '../models/merchantSales';
import { pipeline } from 'stream';
import { promisify } from 'util';

const jsonArrayStream = withParser();
const asyncPipeline = promisify(pipeline);

export async function arrayStreamTest(inputArrayString: string, merchantType?: string) {
    const merchantSales: MerchantSales[] = [];
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
            const merchantIdx = merchantSales.findIndex((merchantRec) => merchantRec.isSameMerchant(data.value.merchantId));
            if (merchantIdx < 0) {
                // Add new merchant to the array (merchantSales)
                const newMerchant = new MerchantSales(data.value.merchantId, data.value.merchantType);
                newMerchant.addTransaction(data.value);
                merchantSales.push(newMerchant);
            } else {
                // Modify exisiting merchant in the array (merchantSales)
                merchantSales[merchantIdx].addTransaction(data.value);
            }
        }
    })
        .on('end', () => {
            console.log(`Completed scanning ${numTransactions} transactions`);
        })

    await asyncPipeline(readable, jsonArrayStream);
    return merchantSales.map((merchant) => merchant.calculateStatistics());
}
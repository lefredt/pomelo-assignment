import { roundToTwoDecimal } from "../util/numbers";

export class MerchantSales {
    private readonly id: string;
    readonly merchantType: string;
    salesSum: number;
    refundSum: number;
    numberOfSales: number;
    orderIds: string[]

    constructor(merchantId: string, merchantType: string) {
        this.id = merchantId;
        this.merchantType = merchantType;
        this.salesSum = 0;
        this.refundSum = 0;
        this.numberOfSales = 0;
        this.orderIds = [];
    }

    isSameMerchant(merchantId: string): boolean {
        return this.id === merchantId;
    }

    addTransaction(transaction: any): void {
        // add new orderIds
        if (!this.orderIds.includes(transaction.orderId)) {
            this.orderIds.push(transaction.orderId)
        }

        // add to purchase sum or refund sum
        if (transaction.value > 0) {
            this.salesSum += transaction.value;
        } else {
            this.refundSum += transaction.value
        }
    }

    calculateStatistics() {
        const netSales = this.salesSum + this.refundSum;
        return {
            merchantId: this.id,
            grossSales: roundToTwoDecimal(this.salesSum),
            netSales: roundToTwoDecimal(netSales),
            averageOrder: roundToTwoDecimal(netSales / this.orderIds.length)
        }
    }
}
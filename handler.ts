import { Handler } from 'aws-lambda';
import { arrayStreamTest } from './app/controller/statistics';

export const statisticsBase: Handler = async (event: any) => {
  const merchantSalesRecord = await arrayStreamTest(event.body);
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      merchantSalesRecord,
      null,
      2
    ),
  };

  return new Promise((resolve) => {
    resolve(response)
  })
}

export const statisticsMerchant: Handler = async (event: any) => {
  const merchantSalesRecord = await arrayStreamTest(event.body, event.pathParameters.merchantType);

  const response = {
    statusCode: 200,
    body: JSON.stringify(
      merchantSalesRecord,
      null,
      2
    ),
  };

  return new Promise((resolve) => {
    resolve(response)
  })
}

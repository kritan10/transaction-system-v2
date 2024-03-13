import path from "node:path";

import grpc from "@grpc/grpc-js";
import protoloader from "@grpc/proto-loader";

import dotenv from "dotenv";
dotenv.config();

import minimist from "minimist";
const argv = minimist(process.argv.slice(2));

import { dbInit } from "./sql/db.js";

import initConsumer from "./events/consumer.js";
import { KafkaProducer } from "../../../common/libs/kafka-producer.js";

import { transferBalance } from './methods/transfer-balance.js';
import { loadBalance } from './methods/load-balance.js';

async function main() {
  const port = argv?.port ?? 50051;

  await dbInit();
  await initConsumer(port);
  KafkaProducer.init("transactionproducer", process.env.KAFKA_PRODUCE_TOPIC);

  const server = new grpc.Server();

  const transactionProto = protoloader.loadSync(path.resolve("../../common/proto/transaction.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const TransactionService = grpc.loadPackageDefinition(transactionProto).transaction.TransactionService;

  server.addService(TransactionService.service, {
    LoadBalance: loadBalance,
    TransferBalance: transferBalance
  });

  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, _) => {
    console.log(`Server started at port ${port}`);
  });
}

main();

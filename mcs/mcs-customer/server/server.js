import path from "node:path";

import grpc from "@grpc/grpc-js";
import protoloader from "@grpc/proto-loader";

import dotenv from "dotenv";
dotenv.config();

import minimist from "minimist";
const argv = minimist(process.argv.slice(2));

import { createCustomer } from "./methods/create-customer.js";
import { getCustomer } from "./methods/get-customer.js";
import { updateCustomer } from "./methods/update-customer.js";

import { dbInit } from "./sql/db.js";
import initConsumer from "./events/consumer.js";
import { KafkaProducer } from "../../../common/libs/kafka-producer.js";

async function main() {
  const port = argv?.port ?? 50051;

  dbInit();
  await initConsumer(port);
  KafkaProducer.init("clientcustomer", process.env.KAFKA_PRODUCE_TOPIC);

  const server = new grpc.Server();

  const customerProto = protoloader.loadSync(path.resolve("../../common/proto/customer.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const CustomerService = grpc.loadPackageDefinition(customerProto).customer.CustomerService;

  server.addService(CustomerService.service, {
    CreateCustomer: createCustomer,
    ViewCustomer: getCustomer,
    UpdateCustomer: updateCustomer,
  });

  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err) => {
    console.log(`Server started at port ${port}`);
  });
}

main();

import path from "node:path";

import grpc from "@grpc/grpc-js";
import protoloader from "@grpc/proto-loader";

import { createCustomer } from "./methods/create-customer.js";
import { getCustomer } from "./methods/get-customer.js";
import { updateCustomer } from "./methods/update-customer.js";
import { dbInit } from "./sql/db.js";

function main() {
  dbInit();

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

  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    console.log(`Server started at port 50051`);
  });
}

main();

import * as fs from "fs";
import zodToJsonSchema from "zod-to-json-schema";
import { Config } from "../src/index";

const schema = zodToJsonSchema(Config, "ci-config");

fs.writeFileSync("config-schema.json", JSON.stringify(schema, null, 2));

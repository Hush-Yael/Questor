import db from "~/db";
import * as tables from "~/db/schema";
import { getFirstTeacherId, bulkInserts } from "./db.test";

const args: string[] = process.argv.slice(2);

async function main() {
  if (!args.length) return console.error("No argument provided");

  const nameRe = /^table=\w*$/;
  const deleteRe = /^delete$/;
  const amountRe = /^amount=\d*$/;
  const tableArg = args.find((arg) => arg.match(nameRe));
  const deleteArg = args.find((arg) => arg.match(deleteRe));
  const amountArg = args.find((arg) => arg.match(amountRe));

  if (!tableArg) return console.error("No table name provided");

  const tableName = tableArg.split("=")[1];

  if (!(tableName in bulkInserts))
    return console.error("table name is not valid");

  if (deleteArg) {
    await db.delete(tables[tableName as keyof typeof tables]);
    return console.log(`Bulk delete on <${tableName}> executed successfully`);
  }

  const amount = Number(amountArg?.split("=")[1]) || 50;
  const result = await bulkInserts[tableName as keyof typeof bulkInserts](
    amount,
    await getFirstTeacherId()
  );

  console.log(`Bulk insert on <${tableName}> executed successfully`);

  if (typeof result === "object")
    console.log(
      `Number of rows: ${result.rows.length}, affected: ${result.rowsAffected}.`
    );
  else console.dir("Some or all values where replaced or updated");
}

await main();

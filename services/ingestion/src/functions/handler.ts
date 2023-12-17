import { IngestionService } from "./services/IngestionService";

const ingest = async (
)=> {

  let scrapper = new IngestionService();
  
  const result = await scrapper.process();

  return result;
};

export const main = ingest;

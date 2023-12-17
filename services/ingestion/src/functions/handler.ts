import { IngestionService } from "./services/IngestionService";

const ingest = async (
)=> {

  let scrapper = new IngestionService();
  
   await scrapper.process();

};

export const main = ingest;

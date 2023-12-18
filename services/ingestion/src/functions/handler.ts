import { IngestionService } from "./services/IngestionService";

const ingest = async (
):Promise<void> => {

  const scrapper = new IngestionService();
  
  await scrapper.process();

};

export const main = ingest;

import {WebScrapper} from '@functions/provider/WebScrapper';
import { CSVDownloader } from '@functions/provider/CSVDownloader';
import { S3Provider } from '@functions/provider/S3';
import {LambdaLog} from 'lambda-log';

export class IngestionService {
    private webScrapper: WebScrapper;
    private csvDownloader: CSVDownloader;
    private s3Provider: S3Provider;
    private logger: LambdaLog;

    constructor(){
        this.webScrapper = new WebScrapper({address:process.env.SCRAPINGWEB});
        this.csvDownloader = new CSVDownloader();
        this.s3Provider = new S3Provider({bucket: process.env.INGEST_BUCKET});
        this.logger = new LambdaLog();
    }

    async scrapeAllDownloadLinks(){
        this.logger.info('Started download of all the links');
        await this.webScrapper.init();
        const scrapper = await this.webScrapper.scrape();
        const links:string[] = [];
        this.logger.info('Starting link scraping');
        try {
            scrapper('div.pkg-actions a').each((_,element) => {
                const link = scrapper(element).attr('href')||'';
                if(/\.csv$/.test(link)){
                    links.push(link);

                    this.logger.info('Link scraped', {
                        link
                    });
                }
            });
        } catch (error) {
            this.logger.error('Error obtaining the links', {
                error
            });
            throw error;
        }
        return links;
    }

    async downloadCSV({link=''}){
        const linkParts = link.split('/');
        const filename = linkParts[linkParts.length-1];
        const file = await this.csvDownloader.retrieveFile({link});
        return {
            filename:filename,
            content:file
        };
    }

    async uploadFile({file='',route=''}){
        const result = await this.s3Provider.upload({
            file,
            route
        })

        return result.VersionId;
    }

    async process(){
        
        const links = await this.scrapeAllDownloadLinks();
        if(process.env.MODE === 'GET_ALL'){
            const getFiles = links.map((link) => {
                return this.downloadCSV({link});
            });
            const files = await Promise.all(getFiles);
            const uploadFile = files.map((file)=>{
                return this.uploadFile({
                    file:file.content,
                    route:file.filename
                });
            });
            const results = await Promise.all(uploadFile);
            return results
        }else{
            const link = links[links.length-1];
            const file = await this.downloadCSV({link});
            const result = await this.uploadFile({
                file:file.content,
                route:file.filename
            });
            return [result];
        }
    }
}
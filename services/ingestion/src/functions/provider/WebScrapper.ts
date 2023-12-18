import {Axios} from 'axios';
import {CheerioAPI, load} from 'cheerio';
import {LambdaLog} from 'lambda-log';

export class WebScrapper{
    private address:string;
    private axios: Axios;
    private html = '';
    private logger: LambdaLog;

    constructor({
        address = ''
    }){
        this.address=address;
        this.axios = new Axios({});
        this.logger = new LambdaLog();
    }

    async init(): Promise<void>{
        try{
            this.logger.info('Starting web scrapper');
            const result = await this.axios.get<string>(this.address);
            this.logger.info('Obtained html',{
                html:result.data
            } as object);
            this.html = result.data;
        }catch(e){
            this.logger.error('Error Scrapping the web', {
                error:e
            });
            throw e;
        }
    }

    scrape():CheerioAPI{
        const cheerioAPI = load(this.html);
        return cheerioAPI;
    }
}
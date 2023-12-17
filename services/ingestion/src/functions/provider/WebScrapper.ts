import {Axios} from 'axios';
import {load} from 'cheerio';
import {LambdaLog} from 'lambda-log';

export class WebScrapper{
    private address:string;
    private axios: Axios;
    private html: string = '';
    private logger: LambdaLog;

    constructor({
        address = ''
    }){
        this.address=address;
        this.axios = new Axios({});
        this.logger = new LambdaLog();
    }

    async init(){
        try{
            this.logger.info('Starting web scrapper');
            const result = await this.axios.get(this.address);
            this.logger.info('Obtained html',{
                html:result.data
            });
            this.html = result.data;
        }catch(e){
            this.logger.error('Error Scrapping the web', {
                error:e
            });
            throw e;
        }
    }

    async scrape(){
        const cheerioAPI = load(this.html);
        return cheerioAPI;
    }
}
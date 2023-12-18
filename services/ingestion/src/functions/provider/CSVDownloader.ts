import {Axios} from 'axios';
import {LambdaLog} from 'lambda-log';

export class CSVDownloader{
    private axios:Axios;
    private logger: LambdaLog = new LambdaLog();

    constructor(){
        this.axios = new Axios({});
    }

    async retrieveFile({link=''}) : Promise<string>{
        try{
            this.logger.info('Retrieving the csv', {link});
            const file = await this.axios.get<string>(link);
            this.logger.info('CSV retrieved', {csv:file.data});
            return file.data;
        }catch(error){
            this.logger.info('Error retrieving the csv', {error});
            throw error;
        }
    }
}
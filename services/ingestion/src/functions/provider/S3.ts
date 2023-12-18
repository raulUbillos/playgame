import AWS from 'aws-sdk';
import {LambdaLog} from 'lambda-log';

export class S3Provider{
    private s3:AWS.S3;
    private bucket:string;
    private logger: LambdaLog = new LambdaLog();

    constructor({bucket=''}){
        this.s3 = new AWS.S3({
            credentials:{
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
                accessKeyId: process.env.AWS_ACCESS_KEY || '',
            },
            region: process.env.AWS_S3_REGION
        });
        this.bucket = bucket;
    }

    async upload({file='',route=''}):Promise<AWS.S3.PutObjectOutput>{
        this.logger.info('Uploading file to s3');
        const result = await this.s3.putObject({
            Bucket:this.bucket,
            Key:route,
            Body:Buffer.from(file, 'utf-8'),
            ContentType: 'text/csv'
        }).promise();

        if(result.$response.error){
            const error = new Error(`Error uploading the file: ${result.$response.error.code}`);
            this.logger.info('Error uploading file to s3', {error});
            throw error;
        }
        return result.$response.data as AWS.S3.PutObjectOutput;
    }
}
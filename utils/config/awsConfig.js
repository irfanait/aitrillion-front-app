import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.NEXT_PUBLIC_APP_AWS_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityId: process.env.NEXT_PUBLIC_AWS_DATA_IDENTITY_ID,
  }),
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {
    Bucket: process.env.NEXT_PUBLIC_APP_AWS_BUCKET,
  },
});

export default s3;

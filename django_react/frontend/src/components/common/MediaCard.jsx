import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard({ newsData }) {
  return (
    <>
      <div className="col-span-12 sm:col-span-10 md:col-span-10 lg:col-span-10 xl:col-span-10 mt-10">
        <h2 className="text-center text-lg/8 font-semibold leading-8 text-gray-900">
          Crypto News Overview
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {newsData.map((news, index) => (
          <Card key={index} sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 140 }}
              image={news.IMAGE_URL}
              title={news.TITLE}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {news.TITLE ? (news.TITLE.length > 20 ? `${news.TITLE.substring(0, 20)}...` : news.TITLE) : '...'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {(() => {
                  if (!news.BODY) return '...';
                  return news.BODY.length > 100 ? `${news.BODY.substring(0, 100)}...` : news.BODY;
                })()}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" href={news.URL} target="_blank">Learn More</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </>
  );
}

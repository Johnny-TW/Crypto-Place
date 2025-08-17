import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard({ newsData = [] }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-12 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mx-auto max-w-7xl mt-6'>
      {newsData.map(news => (
        <Card key={news.ID} sx={{ maxWidth: 'auto' }}>
          <CardMedia
            sx={{ height: 140 }}
            image={news.IMAGE_URL}
            title={news.TITLE}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {news.TITLE && news.TITLE.length > 20
                ? `${news.TITLE.substring(0, 20)}...`
                : news.TITLE || '...'}
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              {news.BODY && news.BODY.length > 100
                ? `${news.BODY.substring(0, 100)}...`
                : news.BODY || '...'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small' href={news.URL} target='_blank'>
              Learn More
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}

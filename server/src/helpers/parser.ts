import RssParser from 'rss-parser';
import cron from 'node-cron';
import { Article } from './../models/Article';

const parse = (parse_url: string) => {
  const parser = new RssParser();
  cron.schedule('0 * * * *', () => {
    parser.parseURL(parse_url).then(feed => {
      feed.items.forEach(async article => {
        await Article.findOne({ link: article.link })
          .then(existingArticle => {
            if (!existingArticle) {
              const newArticle = new Article({
                title: article.title,
                link: article.link,
                pubDate: article.pubDate,
              });
              newArticle.save();
            }
          })
          .catch(err => {
            if (err) {
              console.error(err);
              return;
            }
          });
      });
    });
  });
};

export default parse;

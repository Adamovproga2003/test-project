import { Request, Response } from 'express';
import { Article } from '../models/Article';
import { StatusCodes } from 'http-status-codes';

class ArticleController {
  createArticle = async (req: Request, res: Response) => {
    // #swagger.tags = ['Article']
    // #swagger.summary = 'Create a new article'
    // #swagger.description = 'Create a new article in DB'
    /* 
    #swagger.security = [{
      "bearerAuth": []
    }] 
    */
    /*
      #swagger.requestBody = {
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ArticleForm"
                    }  
                }
            }
        } 
   */
    const newArticle = await Article.create(req.body);

    /* 
      #swagger.responses[201] = {
          description: 'Success register',
          schema: { 
            article: {
              $ref: '#/components/schemas/Article'
            },
            msg: 'Article has been created!'
          } 
        }
     */
    res
      .status(StatusCodes.CREATED)
      .json({ article: newArticle, msg: 'Article has been created!' });
  };

  getArticles = async (req: Request, res: Response) => {
    // #swagger.tags = ['Article']
    // #swagger.summary = 'Get articles'
    // #swagger.description = 'Get articles from DB'
    /*  
    #swagger.parameters['page'] = {
      in: 'query',
      description: 'Page number',
      type: 'number'
    }
    #swagger.parameters['perPage'] = {
      in: 'query',
      description: 'Count of elements for page',
      type: 'number'
    } 
    */
    const pageNo = +req.params.page || 1;
    const size = +req.params.perPage || 10;
    const query: { skip?: number; limit?: number } = {};
    query.skip = size * (pageNo - 1);
    query.limit = +size;

    const articles = await Article.find({}, {}, query).sort('-pubDate');

    /* 
      #swagger.responses[200] = {
          description: 'Fetch articles',
          schema: {
            articles: {
              $ref: '#/components/schemas/ArticleArray'
            },
            msg: 'All Articles have been fetched!'
          } 
        }
     */
    res
      .status(StatusCodes.OK)
      .json({ articles, msg: 'All Articles have been fetched!' });
  };

  getSingleArticle = async (req: Request, res: Response) => {
    // #swagger.tags = ['Article']
    // #swagger.summary = 'Get single articles'
    // #swagger.description = 'Get single article from DB'
    const { id } = req.params;
    const article = await Article.findById({ _id: id });

    if (!article) {
      /* 
        #swagger.responses[400] = { 
          description: 'Article is not found', 
          schema: { 
            error: 'Requested article not found!'
          } 
        } 
        */
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Requested article not found!' });
    }

    /* 
      #swagger.responses[200] = {
          description: 'Fetch a single article',
          schema: {
            article: {
              $ref: '#/components/schemas/Article'
            },
            msg: 'Success'
          } 
        }
     */
    res.status(StatusCodes.OK).json({ article, msg: 'Success' });
  };

  updateArticle = async (req: Request, res: Response) => {
    // #swagger.tags = ['Article']
    // #swagger.summary = 'Update an article'
    // #swagger.description = 'Update an article in DB'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */

    /*
      #swagger.requestBody = {
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ArticleUpdateForm"
                    }  
                }
            }
        } 
   */
    const { id } = req.params;
    const updatedArticle = await Article.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true },
    );

    if (!updatedArticle) {
      /* 
        #swagger.responses[400] = { 
          description: 'Article is not found', 
          schema: { 
            error: 'Requested article not found!'
          } 
        } 
      */
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Requested article not found!' });
    }

    /* 
      #swagger.responses[200] = {
          description: 'Update an article',
          schema: {
            article: {
              $ref: '#/components/schemas/Article'
            },
            msg: 'Article has been updated'
          } 
        }
     */
    res
      .status(StatusCodes.OK)
      .json({ article: updatedArticle, msg: 'Article has been updated' });
  };

  deleteArticle = async (req: Request, res: Response) => {
    // #swagger.tags = ['Article']
    // #swagger.summary = 'Delete an articles'
    // #swagger.description = 'Delete an article from DB'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    const { id } = req.params;
    const deletedArticle = await Article.findByIdAndDelete({ _id: id });

    if (!deletedArticle) {
      /* 
        #swagger.responses[400] = { 
          description: 'Article is not found', 
          schema: { 
            error: 'Requested article not found!'
          } 
        } 
      */
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Requested article not found!' });
    }

    /* 
      #swagger.responses[200] = {
          description: 'Delete an article',
          schema: {
            article: {
              $ref: '#/components/schemas/Article'
            },
            msg: 'Article has been deleted'
          } 
        }
     */
    res
      .status(StatusCodes.OK)
      .json({ article: deletedArticle, msg: 'Article has been deleted' });
  };
}

export const articleController = new ArticleController();
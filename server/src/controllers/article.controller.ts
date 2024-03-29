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
    #swagger.parameters['filter'] = {
      in: 'query',
      description: 'Filter by title',
      type: 'string'
    }
    #swagger.parameters['sort'] = {
      in: 'query',
      description: 'Sort ascending/descending by pubDate',
      type: 'string',
      enum: ['1', '-1']
    } 
    */
    const pageNo = +(req.query.page || 1);
    const size = +(req.query.perPage || 10);
    const filter: any = req.query.filter;
    const sort: any = +(req.query.sort || 1);

    const skip = size * (pageNo - 1);
    const limit = +size;

    const cursor = await Article.find(
      filter ? { $text: { $search: filter } } : {},
    )
      .sort({ pubDate: sort })
      .limit(limit)
      .skip(skip);

    let totalPages;
    if (req.query.filter) {
      totalPages = Math.ceil(cursor.length / size);
    } else {
      const count = await Article.countDocuments();
      totalPages = Math.ceil(+count / size);
    }
    /* 
      #swagger.responses[200] = {
          description: 'Fetch articles',
          schema: {
            articles: {
              $ref: '#/components/schemas/ArticleArray'
            },
            msg: 'All Articles have been fetched!',
            totalPages: 0
          } 
        }
     */
    res.status(StatusCodes.OK).json({
      articles: cursor,
      msg: 'All Articles have been fetched!',
      totalPages,
    });
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

// src/modules/Users/controllers/userController.ts
import type { Request, Response, NextFunction } from 'express';
import * as utilService from '../services/utilsServices.ts';
import type * as UtilInterface from '../types/utilsTypes.ts';

export const fetchDates = async (
  req: Request<UtilInterface.FetchDateRequest>,
  res: Response<UtilInterface.ApiResponse<UtilInterface.FetchDateResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await utilService.fetchDates(req.body);
    res.status(200).json({ response: result, status: 'success', message: 'Available dates retrieved successfully!' });
  } catch (error) {
    next(error);
  }
};


export const parseCategories = async (
  req: Request<UtilInterface.ParseCategoriesRequest>,
  res: Response<UtilInterface.ApiResponse<UtilInterface.ParseCategoriesResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await utilService.parseCategories(req.body);
    res.status(200).json({ response: result, status: 'success', message: 'Available categories parsed successfully!' });
  } catch (error) {
    next(error);
  }
};

export const downloadCategoriesFiles = async (
  req: Request<UtilInterface.DownloadFilesFromCategoryRequest>,
  res: Response<UtilInterface.ApiResponse<UtilInterface.DownloadFilesFromCategoryResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await utilService.downloadCategoriesFiles(req.body);
    res.status(200).json({ response: result, status: 'success', message: 'Files downloaded successfully!' });
  } catch (error) {
    next(error);
  }
}

export const unzipFiles = async (
  req: Request<UtilInterface.UnzipFilesRequest>,
  res: Response<UtilInterface.ApiResponse<UtilInterface.UnzipFilesResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await utilService.unzipFiles(req.body);
    res.status(200).json({ response: result, status: 'success', message: 'Files unzipped successfully!' });
  } catch (error) {
    next(error);
  }
};

export const importFiles = async (
  req: Request<UtilInterface.ImportFilesRequest>,
  res: Response<UtilInterface.ApiResponse<UtilInterface.ImportFilesResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await utilService.importFiles(req.body);
    res.status(200).json({ response: result, status: 'success', message: 'Files imported successfully!' });
  } catch (error) {
    next(error);
  }
};








// src/modules/Users/services/userService.ts
import { util } from '../data-access/utilsRepo.ts';
import { fileURLToPath } from 'url';

import { UpstreamServerFailure } from '../../../core/errors/customErrors.ts';
import path from 'path';
import type * as UtilInterface from '../types/utilsTypes.ts';

export const fetchDates = async (): Promise<UtilInterface.FetchDateResponse> => {
  const result = await util.fetchDates();

  if (!result.dates) {
    throw new UpstreamServerFailure('Unable to retrieve the dates from "arquivos.receitafederal.gov.br"');
  }
  
  return result;
};

export const parseCategories = async (body: UtilInterface.ParseCategoriesRequest): Promise<UtilInterface.ParseCategoriesResponse> => {
  const { date } = body;
  const result = await util.parseCategories(date);

  if (!result.categories) {
    throw new UpstreamServerFailure('Unable to retrieve the categories from "arquivos.receitafederal.gov.br"');
  }

  return result;
}

export const downloadCategoriesFiles = async (body: UtilInterface.DownloadFilesRequest): Promise<UtilInterface.DownloadFilesResponse> => {
  const { date, categories } = body;
  const result = await util.downloadCategoriesFiles(date, categories);

  if (!result.files) {
    throw new UpstreamServerFailure('Unable to download the files from "arquivos.receitafederal.gov.br"');
  }

  return result;
}

export const unzipFiles = async (
  body: UtilInterface.UnzipFilesRequest
): Promise<UtilInterface.UnzipFilesResponse> => {
  // body.fileName must be defined
  return util.unzipFiles(body.fileName);
};


export const importFiles = async (
  body: UtilInterface.ImportFilesRequest
): Promise<UtilInterface.ImportFilesResponse> => {
  const category = body.category.value;
  try {
    const result = await util.importFiles(category);
    if (result.importedCount <= 0) {
      throw new UpstreamServerFailure(`No records imported for "${category}"`);
    }
    return result;
  } catch (err) {
    throw new UpstreamServerFailure(`Failed to import data for "${category}"`);
  }
};





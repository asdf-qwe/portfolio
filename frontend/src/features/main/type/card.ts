import { CategoryName } from "./skillCategory";

export interface CardDto {
  title: string;
  subTitle: string;
  content: string;
}

export interface CardResponse {
  title: string;
  subTitle: string;
  content: string;
  categoryName: CategoryName;
}

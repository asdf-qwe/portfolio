// Enum for CategoryName (Java enum equivalent)
export enum CategoryName {
  SKILLS = "SKILLS",
  PERSONALITY = "PERSONALITY",
  INTERESTS = "INTERESTS",
  EXPERIENCE = "EXPERIENCE",
}

// SkillCategoryRequest DTO (Java @Getter equivalent)
export interface SkillCategoryRequest {
  name: CategoryName;
}

// SkillCategoryResponse DTO (Java @Getter @AllArgsConstructor equivalent)
export interface SkillCategoryResponse {
  name: CategoryName;
}

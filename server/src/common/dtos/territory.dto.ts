import { IsString, IsOptional } from "class-validator";

export class TerritoryDto {
    @IsOptional()
    @IsString({ message: "Должно быть строкой" })
    country?: string;

    @IsOptional()
    @IsString({ message: "Должно быть строкой" })
    region?: string;

    @IsOptional()
    @IsString({ message: "Должно быть строкой" })
    locality?: string;
}

import { CategorySwaggerDocs } from "src/api/category/swagger";
import { ApplicationSwaggerDocs } from "../api/application/swagger";
import { AuthSwaggerDocs } from "../api/auth/swagger";
import { BacklistSwaggerDocs } from "../api/backlist/swagger";
import { CompanySwaggerDocs } from "../api/company/swagger";
import { CurrencySwaggerDocs } from "../api/currency/swagger";
import { DistrictSwaggerDocs } from "../api/district/swagger";
import { ExchangeRateSwaggerDocs } from "../api/exchange_rate/swagger";
import { FinanceSwaggerDocs } from "../api/finance/swagger";
import { FolderSwaggerDocs } from "../api/folder/swagger";
import { GallerySwaggerDocs } from "../api/gallery/swagger";
import { NationalitySwaggerDocs } from "../api/nationality/swagger";
import { NumberSwaggerDocs } from "../api/number/swagger";
import { OfficeSwaggerDocs } from "../api/office/swagger";
import { PositionSwaggerDocs } from "../api/position/swagger";
import { PriceSwaggerDocs } from "../api/price/swagger";
import { ProfileSwaggerDocs } from "../api/profile/swagger";
import { ProfileGallerySwaggerDocs } from "../api/profileGallery/swagger";
import { ProvinceSwaggerDocs } from "../api/province/swagger";
import { RefundSwaggerDocs } from "../api/refund/swagger";
import { ReportSwaggerDocs } from "../api/report/swagger";
import { UserSwaggerDocs } from "../api/user/swagger";
import { VillageSwaggerDocs } from "../api/village/swagger";
import { PaginatedResponseSwaggerDocs } from "./paginate";

export const RegistrySwaggerDocs = {
  components: {
    schemas: {
      ...AuthSwaggerDocs.components.schemas,
      ...PaginatedResponseSwaggerDocs.components.schemas,
      ...PriceSwaggerDocs.components.schemas,
      ...OfficeSwaggerDocs.components.schemas,
      ...NumberSwaggerDocs.components.schemas,
      ...RefundSwaggerDocs.components.schemas,
      ...CurrencySwaggerDocs.components.schemas,
      ...ExchangeRateSwaggerDocs.components.schemas,
      ...ProfileGallerySwaggerDocs.components.schemas,
      ...CategorySwaggerDocs.components.schemas,
    },
  },
  paths: {
    ...AuthSwaggerDocs.paths,
    ...UserSwaggerDocs.paths,
    ...ProvinceSwaggerDocs.paths,
    ...ProfileSwaggerDocs.paths,
    ...PriceSwaggerDocs.paths,
    ...PositionSwaggerDocs.paths,
    ...OfficeSwaggerDocs.paths,
    ...NumberSwaggerDocs.paths,
    ...NationalitySwaggerDocs.paths,
    ...FolderSwaggerDocs.paths,
    ...FinanceSwaggerDocs.paths,
    ...DistrictSwaggerDocs.paths,
    ...CompanySwaggerDocs.paths,
    ...ApplicationSwaggerDocs.paths,
    ...BacklistSwaggerDocs.paths,
    ...ReportSwaggerDocs.paths,
    ...RefundSwaggerDocs.paths,
    ...VillageSwaggerDocs.paths,
    ...GallerySwaggerDocs.paths,
    ...CurrencySwaggerDocs.paths,
    ...ExchangeRateSwaggerDocs.paths,
    ...ProfileGallerySwaggerDocs.paths,
    ...CategorySwaggerDocs.paths,
  },
};

import { AUTH_MESSAGES } from "./auth.message";
import { CATEGORY_MESSAGE } from "./category.message";
import { COLOR_MESSAGE } from "./color.message";
import { ERROR_MESSAGE } from "./error.message";
import { ROL_MESSAGE } from "./rol.message";
import { SIZE_MESSAGE } from "./size.message";
import { TYPE_VARIANT_MESSAGE } from "./type.variant.message";
import { USER_MESSAGE } from "./user.message";
import { WAREHOUSE_MESSAGE } from "./warehouse.message";

export const MESSAGES = {
    ...AUTH_MESSAGES,
    ...USER_MESSAGE,
    ...ERROR_MESSAGE,
    ...ROL_MESSAGE,
    ...CATEGORY_MESSAGE,
    ...WAREHOUSE_MESSAGE,
    ...TYPE_VARIANT_MESSAGE,
    ...COLOR_MESSAGE,
    ...SIZE_MESSAGE
}
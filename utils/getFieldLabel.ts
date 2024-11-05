import type { UserFieldType } from "~/types/product";
import { UserFieldTypeLabel } from "~/types/product";

export default function (fieldType: UserFieldType): UserFieldTypeLabel {
    switch (fieldType) {
        case 'text':
            return UserFieldTypeLabel.text
        case 'number':
            return UserFieldTypeLabel.number
        case 'options':
            return UserFieldTypeLabel.options
        default:
            console.error(`dynamic field not registered: ${fieldType}`)
            return UserFieldTypeLabel.text
    }
}

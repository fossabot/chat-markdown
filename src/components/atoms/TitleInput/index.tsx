import * as css from "./styles.css"

type TitleInputProps = {
    id?: string
    value?: string
    placeholder?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const TitleInput = ({ id, onChange, placeholder = "Untitled", value, ...rest }: TitleInputProps) => {
    return (
        <div id={id} className={css.container}>
            <input
                className={css.input}
                type="text"
                placeholder={placeholder}
                autoComplete="off"
                value={value}
                onChange={onChange}
                {...rest}
            />
        </div>
    )
}

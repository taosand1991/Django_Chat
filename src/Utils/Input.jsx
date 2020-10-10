import React from 'react'

const Input = ({value, id, label, name, placeholder, className, onchange, ...rest}) => {
    return <div>
        <label htmlFor={id}>{label}</label>
        <input value={value}
                  name={name}
                  placeholder={placeholder}
                  className={className}
                  onChange={onchange}
                    {...rest}/>
    </div>
}

export default Input;
const titleize = (text) => {
  return text.split('_').map(
    e => e.charAt(0).toUpperCase() + e.slice(1)
  ).join(' ')
}

const htmlize = (data) => {

    const Struct2Jsx = (data) => {

        var _map = (_values) => _values.map(
            e =>  Struct2Jsx((typeof(e) === "object" ? e : {[e]: String()}))
        )

        if (Array.isArray(data)) { return _map(data) }
        else {

            var output = []

            Object.entries(data).forEach(([k, v]) => {

                if (Array.isArray(v)) {
                    output.push(`<${k}>${_map(v).join('')}</${k}>`)
                }
                else {
                    switch (typeof(v)) {
                        case "object": {
                            let props = Object.entries(v).map(([key, value]) => `${key}="${value}" `).join('')
                            output.push(`<${k} ${props}/>`)
                            break
                        }
                        case "string": {
                            output.push((v.length === 0 ? `<${k} />` : `<${k}>${v}</${k}>`))
                            break
                        }
                        default: {
                            output.push(`<${k}>${v}</${k}>`)
                        }
                    }
                }

            })

            return output.join('')

        }

    }

    return Struct2Jsx(data).join('')

}

const Helpers = {
    htmlize,
    titleize,
}

export default Helpers
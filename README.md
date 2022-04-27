<h1 align="center">
  <br>
  <img
    src="./img/zeev-binder-badge.png"
    alt="Zeev Binder Badge - Theater Mask emoji inside a glowing purple hexagon"
  >
  <p>Zeev Binder</p>

  [![CDN](https://data.jsdelivr.com/v1/package/gh/pedbernardo/zeev-binder/badge)](https://www.jsdelivr.com/package/gh/pedbernardo/zeev-binder)
  [![NPM](https://img.shields.io/npm/v/zeev-binder)](https://www.npmjs.com/package/zeev-binder)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</h1>

<p align="center">
  Biblioteca <em>não-oficial</em> para <strong>data binding</strong> em campos de formulário no <a href="http://zeev.it" target="_blank">Zeev</a>.<br>
  Construa views com base nos valores dos campos de formulário, <strong>atualize</strong> os valores <strong>automaticamente</strong> e combine com funções de <strong>filtro</strong>, aplicando facilmente máscaras e outras transformações aos dados.
</p>

<p align="center">
  <a href="#instalação">Instalação</a> |
  <a href="#como-utilizar">Como Utilizar</a> |
  <a href="#configuração">Configuração</a> |
  <a href="#métodos">Métodos</a> |
  <a href="#Roadmap">Roadmap</a>
</p>

<p align="center">
  <img
    src="./img/example.gif"
    alt="Zeev Binder running example on screen"
  >
</p>

<br>

<details>
  <summary>Veja o código do exemplo acima</summary>
  
  #### Formulário
  ```html
  <h1>🎭 Zeev Binder</h1>
  <p>O que é data-binding?</p>

  <div class="o-columns u-margin-top-10">
    <div class="o-column">
      <div class="o-form-group">
        <label class="o-form-label">CNPJ</label>
        <p class="o-form-label-help">Exemplo: 59539586000100</p>
        <div class="o-form-ctrl">{Campo.campoTexto}</div>
      </div>
    </div>

    <div class="o-column">
      <span>O valor do campo aparecerá aqui:</span>
      <h3>{{ campoTexto | cnpj }}</h3>
      <span>Mas pode aparecer em outros lugares</span>
      <small>{{ campoTexto | cnpj }}</small>
    </div>
  </div>
  ```
  #### Javascript
  ```js
  import Binder from 'zeev-binder'

  Binder().init()
  ```
</details>

<br>

## Instalação
### Usar via NPM

```bash
npm install zeev-binder

# ou com yarn

yarn add zeev-binder
```

### Usar via CDN
Apenas adicione a script tag ao cabeçalho do processo e inicialize o binder  através do _construtor_ Binder
```html
<script src="https://cdn.jsdelivr.net/gh/pedbernardo/zeev-binder@latest/dist/binder.js"></script>

<!-- ou minificado -->

<script src="https://cdn.jsdelivr.net/gh/pedbernardo/zeev-binder@latest/dist/binder.min.js"></script>
```

<br>
<br>
<br>

## Como Utilizar

```js
// importe todas as funções com namespace
import Binder from 'zeev-binder'

// utilizando apenas as configurações padrão
Binder().init()

// utilizando o objeto de configurações
Binder({
  root: '#my-root-element' // redefina o elemento raíz a partir de onde será aplicado o binder 
  filters: {}              // defina novas funções de filtro
}).init()
```

### Víncule o Binder a campos de formulário através do HTML
```html
<!-- o conteúdo receberá o valor do campo de formulário, matendo-o sempre atualizado -->
<span data-bind="idDoCampo"></span>

<!-- não é necessário o uso de tags, basta utilizar {{ }} -->
somente o trecho {{ idDoCampo }} será atualizado com o valor do campo de formulário
```

### Faça uso de filtros para aplicar transformações aos valores
```html
<!-- aplique máscaras ou outras transformações -->
<span data-bind="meuCampoCnpj" data-filter="cnpj"></span>

<!-- quando utilizado com data-bind é possível que o filtro retorne HTML inclusive -->
<span data-bind="meuCampo" data-filter="construirTag"></span>

<!-- o filtro poderia retornar, por exemplo
<span data-bind="meuCampo" data-filter="construirTag">
  <span class"tag">valor do campo</span>
</span>
-->

<!-- também é possível utilizar filtros com o uso de {{ }} -->
basta indicar o filtro com uso do caracter "|" {{ meuCampoCnpj | cnpj }}
```

### Utilizando via script tag e CDN
```js
// basta utilizar o construtor Global Binder
Binder().init()
```

<br>
<br>
<br>

## Configuração

**Configuração Padrão**
```js
const config = {
  root: document.getElementById('BoxFrmExecute') || document.body,
  filters: { ... } // ver seção sobre filtros
}
```

### Construtor
### `Binder`
Cria uma nova instância do Binder com as configurações informadas

> _Binder( Object )_

**Exemplo de uso**
```js
const binder = Binder({
  root: '#my-custom-root-element'
})

binder.init()
```

#### Parâmetros
> _BinderConfig (Object)_

<br>

- _BinderConfig.root ( HTMLElement )_<br>
**Default:** document.getElementById('BoxFrmExecute') || document.body<br>
Elemento raíz a partir de onde será aplicado o binder

- _BinderConfig.filters ( Ojbect )_<br>
Objeto com funções / métodos customizados para serem consumidas como filtros

<br>

### Filtros
Existem alguns filtros pré-definidos que podem ser utilizados sem nenhum configuração extra, veja as funções em [filtres.js](./src/utils/filters.js).

<br>

#### `cnpj`
Adiciona máscara de CNPJ a um número de 14 caracteres

> 59539586000100 => 59.539.586.0001-00

**Exemplo de uso**
```html
{{ meuCampo | cnpj}}
<span data-bind="meuCampo" data-filter="cnpj">
```

<br>

#### `capitalize`
Capitalize um texto, tornando todas as letras iniciais em maiúsculas

> minha frase EXEMPLO => Minha Frase Exemplo

**Exemplo de uso**
```html
{{ meuCampo | capitalize}}
<span data-bind="meuCampo" data-filter="capitalize">
```

<br>

#### `firstWord`
Extrai apenas a primeira palavra de um texto

> João da Silva Sauro => João

**Exemplo de uso**
```html
{{ meuCampo | firstWord}}
<span data-bind="meuCampo" data-filter="firstWord">
```

<br>

#### `empty`
Quando o texto for vazio, preenche com o caractere "-"

**Exemplo de uso**
```html
{{ umCampoMonetario | empty}}
<span data-bind="umCampoMonetario" data-filter="empty">
```

<br>

#### `hour`
Apenas adiciona ao final do texto a letra "h"

> 120 => 120h

**Exemplo de uso**
```html
{{ meuCampo | hour}}
<span data-bind="meuCampo" data-filter="hour">
```

<br>

#### `currency`
Formata um número para o formato monetário em pt-BR, quando o campo for vazio ou 0 retorna apenas "-" 

> 1500 => 1.500,00
> 1511500.2 => 1.511.500,20
> 0 => -

**Exemplo de uso**
```html
{{ meuCampo | currency}}
<span data-bind="meuCampo" data-filter="currency">
```

<br>

#### Criando Novos Filtros

Para criar novos filtros é simples, basta criar novas funções dentro na propridade `filters` do parâmetro de configuração do método construtor.

As funções presentes no filter sempre recebem do Binder como parâmetro o valor atual do campo, e devem retornar o valor que será apresentado nos binds do formulário (no html).

**Exemplo**
```js
Binder({
  filters: {
    nomeDoMeuFiltro (valorDoCampo) {
      // faça as transformações desejadas
      // e então retone o valor transformado
      return valorDoCampo * 2
    },
    outroFiltro (valor) {
      return `R$ ${valor}`
    },
    tagCriticidade (valor) {
      // com o uso do `data-bind` é possível
      // retornar uma string html que será adicionada
      // ao formulário (DOM) e ainda combinar com
      // condicionais
      if (valor === 'Crítico') {
        return `<span class="tag danger">${valor}</span>`
      } else {
        return `<span class="tag">${valor}</span>`
      }
    }
  }
}).init()
```

Após definidos os filtros, basta utilizá-los assim como os filtros padrão, veja no exemplo a utilização dos filtros criados no exemplo acima.

```html
{{ meuCampo | nomeDoMeuFiltro }}<br>
{{ meuOutroCampo | outroFiltro }}<br>

<div
  data-bind="campoCriticidade"
  data-filter="tagCriticidade"
></div>
```

<br>
<br>
<br>

## Métodos

<br>

- [init](#init)
- [update](#update) _TODO_
- [destroy](#destroy) _TODO_

<br>

### `init`
Inicializa a instância do Binder, adicionando event listeners aos campos para observar mudanças, aplicando o estado inicial dos campos de formulário as referências do binder presentes no formulário

> _Binder.init()_

**Exemplo de uso**
```js
const binder = Binder()
binder.init()
```

<br>

### `update`
_TODO_

> _Binder.update()_

**Exemplo de uso**
```js
const binder = Binder()
binder.update()
```

<br>

### `destroy`
_TODO_

> _Binder.destroy()_

**Exemplo de uso**
```js
const binder = Binder()
binder.destroy()
```

<br>
<br>
<br>

## Roadmap

**Versão 1.0.0**
- Alterar definição de tipos de JSDocs para TypeScript
- Adicionar testes unitários
- Implementar métodos update e destroy
- Implementar adição de propriedade ao finalizar inicialização (facilitar criação de loaders)
- Avaliar implementação de skeletons com uso de {{ }}
- Finalizar documentação no README
- Construir documentação utilizando Vitepress
- Automatizar build com uso de Github Actions

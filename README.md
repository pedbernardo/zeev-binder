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
<script src="https://cdn.jsdelivr.net/gh/pedbernardo/orquestra-binder@latest/dist/zeev-binder.js"></script>

<!-- ou minificado -->

<script src="https://cdn.jsdelivr.net/gh/pedbernardo/orquestra-binder@latest/dist/zeev-binder.min.js"></script>
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
  root: '#BoxFrmExecute' || document.body,
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

#### _TODO_
- descrever funcionamento de filtros e filtros padrão
- descrever funcionamento e restrições com uso de tabelas multivaloradas

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
- Finalizar documentação no README
- Construir documentação utilizando Vitepress
- Automatizar build com uso de Github Actions

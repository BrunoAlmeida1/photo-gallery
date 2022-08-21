//Criação da classe PhotoGallery com suas variáveis e a chamada da função eventHandle. Dessa forma, quando esta classe for instanciada afunção irá rodar dando dinamismo à nossa página.
class PhotoGallery{
    constructor(){
        this.API_KEY = '563492ad6f91700001000001d6192522ebe84246b1095e22c1f79e7b';
        this.galleryDiv = document.querySelector('.gallery');
        this.searchForm = document.querySelector('.header form');
        this.loadMore = document.querySelector('.load-more');
        this.logo = document.querySelector('.logo');
        this.pageIndex = 1;
        this.searchValueGlobal = '';
        this.eventHandle();
    }
    //Método Identificador de eventos - Quando o evento "Carrega conteúdo do DOM" é executado, ele chama a função getImg()
    eventHandle(){
        document.addEventListener('DOMContentLoaded', ()=>{
            this.getImg(1);
        });
        this.searchForm.addEventListener('submit', (e)=>{
           this.pageIndex = 1;
           this.getSearchedImages(e);
        });
        this.loadMore.addEventListener('click', (e)=>{
            this.loadMoreImages(e);
        });
        this.logo.addEventListener('click', ()=>{
            this.pageIndex = 1;
            this.galleryDiv.innerHTML = '';
            this.getImg(this.pageIndex);
        })
    }
    //Na url base que encontramos na documentação da API do pexels.com, acrescentamos o &page=${index} antes de per_page=12, para que assim novas imagens sejam carregadas ao clicar em carregar imagens.
    async getImg(index){
        this.loadMore.setAttribute('data-img', 'curated');
        const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos); //O photos é um arquivo presente no json recebido da requisição.
        console.log(data);
    }
    //Faz a requisição de imagens ao servidor da Pexels.com

    /*A palavra reservada await é usada aqui porque o Javascript roda de forma síncrona e por isso ele precisa de um comando que pause a execução do código até que receba a Promisse (de uma função assíncrona) e esse comando é o await*/
    async fetchImages(baseURL){
        const response = await fetch(baseURL, {
            method:'GET',
            headers:{
                Accept: 'application/json',
                Authorization: this.API_KEY
            }
        });
        const data = await response.json();
        return data;
    }
    //Esta função cria divs dentro da div gallery do documento HTML, contendo elemento <a> com links para imagens do servidor e o respectivo nome dos fotográfos.
    GenerateHTML(photos){
        photos.forEach(photo=>{
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
            <a href = '${photo.src.original}' target="_blank">
                <img src = "${photo.src.medium}">
                <h3>${photo.photographer}</h3>
            </a>
            `;
            this.galleryDiv.appendChild(item);
        })
    }
    //Faz a busca por imagens ao pegar o evento (e) submit que foi chamado na função "eventHandle()" e através da referência ao objeto que acionou o evento feita pelo método e.target ele pega o valor subimetido em input para fazer a busca por meio da URL base fornecida na documentação da API (acrescentando o &page=1 antes de per_page=12, para que assim novas imagens sejam carregadas ao clicar em carregar imagens), enviando-a para a função fetchImagens que irá requisitar as imagens ao servidor. Por fim é chamada a função GenerateHTML() para que as novas fotos sejam geradas na nossa página.
    async getSearchedImages(e){
        this.loadMore.setAttribute('data-img', 'search');
        e.preventDefault();
        this.galleryDiv.innerHTML = '';
        const searchValue = e.target.querySelector('input').value;
        this.searchValueGlobal = searchValue;
        const baseURL = await `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
        e.target.reset();
    }
    async getMoreSearchedImages(index){
        const baseURL = await `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`;
        const data = await this.fetchImages(baseURL);
        this.GenerateHTML(data.photos);
    }
    //Esta função carrega novas imagens ao somar mais um ao index que será atribuído ao número de páginas da url base. E a condicional diz que se o valor do atributo data-img for curated será acrescetadas páginas às imagens curadas que vem na página inicial. 
    loadMoreImages(e){
        let index = ++this.pageIndex;
        const loadMoreData = e.target.getAttribute('data-img');
        if(loadMoreData === 'curated'){
            this.getImg(index)
        }else{
            this.getMoreSearchedImages(index);
        }
    }
}

const gallery = new PhotoGallery;
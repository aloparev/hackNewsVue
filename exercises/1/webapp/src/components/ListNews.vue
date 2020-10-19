<template>
    <div>
        <div class="list-item">
            <h1>News List</h1>
            <news 
                v-for="item in getNews"
                v-bind:key="item.id"
                v-bind:news="item" 
                @deleteNews="deleteNews(item.id)"
            />
        </div>
        <create-news @addNews="addNews" />
    </div>
</template>
 
<script>
import News from "./News.vue"
import CreateNews from './CreateNews.vue';

export default {
    name: 'list-news',
    data () {
        return {
            list:[
                {id:0, title:"Just", votes:0},
                {id:1, title:"VueJS", votes:0},
                {id:2, title:"Rocks", votes:0}
            ]
        }
    },
    components: {
        News,
        CreateNews
    },
    methods:{
        deleteNews: function(id){
            this.list.splice(this.list.findIndex(e => e.id == id),1);
        },
        addNews: function(newNews){
            let id = 0;
            
            if(this.list.length > 0) {
                id = Math.max(...this.list.map(e => e.id));
                id++;
            }
            
            newNews.id = id;
            
            this.list.push(newNews);
        }
    },
    computed:{
        getNews: function(){
            let newList = [...this.list];
            return newList.sort((x,y) => y.votes - x.votes);
        }
    }
}
</script>

<style>

</style>
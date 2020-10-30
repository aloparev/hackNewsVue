<template>
    <div>
        <h2>{{news.title}} ({{news.votes}})</h2>
        <div class="list-action-btn">
            <button @click="updateItem(1)">Upvote</button>
            <button @click="updateItem(-1)">Downvote</button>
            <button @click="deleteItem">Remove</button>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        news: {
          type: Object,
          default: () => ({})
        }
    },
    methods: {
        deleteItem : function(){
            this.$emit("deleteNews");
        },
        updateItem : function(value){
            this.$emit('update', {...this.news, votes: (this.news.votes + value)})
        }
    }
}
</script>

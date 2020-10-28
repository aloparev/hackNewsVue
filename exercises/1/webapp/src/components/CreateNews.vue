<template>
        <form @submit.prevent="addNews" class="add-item">
            <input type="text" v-model="title" placeholder="title"/>
            <button type="submit" @click="addNews">Create</button>
        </form>
</template>

<script>
export default {
    data() {
        return {
            title:""
        }
    },
    methods: {
        addNews(){

            if(!this.title || this.title.trim() == ""){
                preventDefault();
            }

            this.$emit("addNews", {title:this.title, votes:0})
            this.title = "";
        }
    }
}
</script>

<style>

</style>

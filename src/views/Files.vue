<template>
    <Header
        ref="header"
        title="Your Files"
        subtitle="Everything you've uploaded is right here."
        :buttons="[
            {
                text: 'Back',
                to: '/me/',
                title: 'Head back to the main dashboard.'
            }
        ]"
    />
    <div ref="files" class="projects">
        <Project
            v-for="file in files"
            :key="file.filename"
            :classes="['auth', 'float']"
            :to="`/me/file/${file.filename}/`"
            :title="file.filename"
        >
            Click me to look at info about the file {{ file.filename }}
        </Project>
    </div>
    <Footer>
        <div v-if="!loading && !hideLoadMore" class="loadmore">
            <p class="footer_text" @click="loadMore">
                Load More
            </p>
        </div>
        <div v-else-if="!hideLoadMore" class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </Footer>
</template>

<script>
import Header from '@/components/Header.vue';
import Project from '@/components/Project.vue';
import Footer from '@/components/Footer.vue';
export default {
    name: 'Files',
    title: 'Your Files',
    components: {
        Header,
        Project,
        Footer
    },
    data() {
        return {
            loading: true,
            hideLoadMore: false,
            offset: 0,
            files: []
        };
    },
    beforeCreate() {
        fetch('/api/user/', {
            headers: {
                Authorization: `${window.localStorage.getItem('token')}`
            }
        }).then(res => {
            switch (res.status) {
                case 200:
                    fetch('/api/files?offset=' + this.offset, {
                        headers: {
                            Authorization: window.localStorage.getItem('token')
                        }
                    }).then(uploads => {
                        if (uploads.status === 200) {
                            uploads.json().then(json => {
                                this.$refs.header.sharedState.subtitle =
                                    this.$refs.header.sharedState.subtitle +
                                    `\nYou've uploaded ${json.count} files.`;
                                this.offset += json.files.length;
                                this.files.push(...json.files);
                                this.loading = false;
                            });
                        }
                    });
                    break;
                case 429:
                    this.$parent.$parent.temporaryToast(
                        `Woah, slow down! Please wait ${Math.floor(
                            (res.headers.get('x-ratelimit-reset') * 1000 -
                                Date.now()) /
                                1000 /
                                60
                        )} minutes ${
                            Math.floor(
                                ((res.headers.get('x-ratelimit-reset') * 1000 -
                                    Date.now()) /
                                    1000) %
                                    60
                            ) !== 0
                                ? `and ${Math.floor(
                                      ((res.headers.get('x-ratelimit-reset') *
                                          1000 -
                                          Date.now()) /
                                          1000) %
                                          60
                                  )} seconds`
                                : ''
                        } before trying again!`
                    );
                    break;
                default:
                    this.$router.push(
                        `/auth/?redirect=${window.location.pathname}`
                    );
                    break;
            }
        });
    },
    methods: {
        loadMore() {
            this.loading = true;
            fetch('/api/files?offset=' + this.offset, {
                headers: {
                    Authorization: window.localStorage.getItem('token')
                }
            }).then(uploads => {
                switch (uploads.status) {
                    case 200:
                        uploads.json().then(json => {
                            this.offset += json.files.length;
                            if (json.files.length < 1) {
                                this.hideLoadMore = true;
                            }
                            this.files.push(...json.files);
                            this.loading = false;
                        });
                        break;
                    case 429:
                        this.$parent.$parent.temporaryToast(
                            `Woah, slow down! Please wait ${Math.floor(
                                (uploads.headers.get('x-ratelimit-reset') *
                                    1000 -
                                    Date.now()) /
                                    1000 /
                                    60
                            )} minutes ${
                                Math.floor(
                                    ((uploads.headers.get('x-ratelimit-reset') *
                                        1000 -
                                        Date.now()) /
                                        1000) %
                                        60
                                ) !== 0
                                    ? `and ${Math.floor(
                                          ((uploads.headers.get(
                                              'x-ratelimit-reset'
                                          ) *
                                              1000 -
                                              Date.now()) /
                                              1000) %
                                              60
                                      )} seconds`
                                    : ''
                            } before trying again!`
                        );
                        break;
                    default:
                        this.$parent.$parent.temporaryToast(
                            'An unknown error occurred, if this issue persists contact AlekEagle.'
                        );
                        break;
                }
            });
        }
    }
};
</script>

<style>
.loadmore {
    padding-bottom: 23px;
}
.loadmore p {
    cursor: pointer;
}
</style>

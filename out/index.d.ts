declare const usetube: {
    getVideoDate: typeof getVideoDate;
    getChannelDesc: typeof getChannelDesc;
    searchVideo: typeof searchVideo;
    searchChannel: typeof searchChannel;
    getChannelVideos: typeof getChannelVideos;
};
export default usetube;
declare function getVideoDate(id: string): Promise<any>;
declare function getChannelDesc(id: string): Promise<string | undefined>;
declare function searchVideo(terms: string, token?: string): Promise<{
    tracks: any;
    token: string | undefined;
} | undefined>;
declare function searchChannel(terms: string, token?: string): Promise<{
    channels: any;
    token: string | undefined;
} | undefined>;
declare function getChannelVideos(id: string, published_after?: Date): Promise<any>;
//# sourceMappingURL=index.d.ts.map
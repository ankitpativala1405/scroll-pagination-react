export interface PaginationOptions {
    threshold?: number;
    onLoadMore: (page: number) => Promise<void>;
}

export class ScrollPagination {
    private page = 1;
    private loading = false;

    constructor(private options: PaginationOptions) {}

    start() {
        window.addEventListener("scroll", this.handleScroll);
    }

    stop() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    private handleScroll = async () => {
        if (this.loading) return;

        const threshold = this.options.threshold ?? 300;

        const bottom =
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - threshold;

        if (!bottom) return;

        this.loading = true;

        await this.options.onLoadMore(++this.page);

        this.loading = false;
    };
}
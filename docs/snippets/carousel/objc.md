```objc
@interface CarouselView () <UICollectionViewDataSource, UICollectionViewDelegate>
@property (nonatomic, strong) UICollectionView *collectionView;
@property (nonatomic, strong) UIPageControl *pageControl;
@property (nonatomic, copy) NSArray<UIImage *> *images;
@property (nonatomic, strong) NSTimer *timer;
@end

@implementation CarouselView

- (void)setupWithImages:(NSArray<UIImage *> *)images {
    self.images = images;
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    layout.scrollDirection = UICollectionViewScrollDirectionHorizontal;
    layout.minimumLineSpacing = 0;
    self.collectionView = [[UICollectionView alloc] initWithFrame:self.bounds collectionViewLayout:layout];
    self.collectionView.pagingEnabled = YES; // 整页滑动
    self.collectionView.dataSource = self;
    self.collectionView.delegate = self;
    [self.collectionView registerClass:[UICollectionViewCell class] forCellWithReuseIdentifier:@"cell"];
    layout.itemSize = self.bounds.size;
    [self addSubview:self.collectionView];

    self.pageControl = [[UIPageControl alloc] init];
    self.pageControl.numberOfPages = images.count;
    [self addSubview:self.pageControl];
    [self startAutoPlay];
}

- (void)startAutoPlay {
    // 减少动态效果时不自动播放
    if (UIAccessibilityIsReduceMotionEnabled() || self.images.count < 2) return;
    __weak typeof(self) weakSelf = self;
    self.timer = [NSTimer scheduledTimerWithTimeInterval:4 repeats:YES block:^(NSTimer *t) {
        NSInteger next = (weakSelf.pageControl.currentPage + 1) % weakSelf.images.count;
        [weakSelf.collectionView scrollToItemAtIndexPath:[NSIndexPath indexPathForItem:next inSection:0]
                                        atScrollPosition:UICollectionViewScrollPositionCenteredHorizontally
                                                animated:YES];
        weakSelf.pageControl.currentPage = next;
    }];
}

- (NSInteger)collectionView:(UICollectionView *)cv numberOfItemsInSection:(NSInteger)section {
    return self.images.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)cv cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    UICollectionViewCell *cell = [cv dequeueReusableCellWithReuseIdentifier:@"cell" forIndexPath:indexPath];
    cell.backgroundView = [[UIImageView alloc] initWithImage:self.images[indexPath.item]];
    return cell;
}

// 拖动时暂停，停下后更新圆点并恢复
- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView { [self.timer invalidate]; }
- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    self.pageControl.currentPage = lround(scrollView.contentOffset.x / MAX(scrollView.bounds.size.width, 1));
    [self startAutoPlay];
}
@end
```

```swift
final class CarouselView: UIView, UICollectionViewDataSource, UICollectionViewDelegate {
    private let images: [UIImage]
    private let pageControl = UIPageControl()
    private var timer: Timer?
    private lazy var collectionView: UICollectionView = {
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .horizontal
        layout.minimumLineSpacing = 0
        let cv = UICollectionView(frame: .zero, collectionViewLayout: layout)
        cv.isPagingEnabled = true  // 整页滑动
        cv.showsHorizontalScrollIndicator = false
        cv.register(UICollectionViewCell.self, forCellWithReuseIdentifier: "cell")
        cv.dataSource = self
        cv.delegate = self
        return cv
    }()

    init(images: [UIImage]) {
        self.images = images
        super.init(frame: .zero)
        [collectionView, pageControl].forEach(addSubview)
        pageControl.numberOfPages = images.count
        pageControl.addAction(UIAction { [weak self] _ in self?.scroll(to: self?.pageControl.currentPage ?? 0) }, for: .valueChanged)
        startAutoPlay()
    }
    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        collectionView.frame = bounds
        (collectionView.collectionViewLayout as? UICollectionViewFlowLayout)?.itemSize = bounds.size
        pageControl.frame = CGRect(x: 0, y: bounds.height - 30, width: bounds.width, height: 30)
    }

    private func startAutoPlay() {
        // 减少动态效果时不自动播放
        guard !UIAccessibility.isReduceMotionEnabled, images.count > 1 else { return }
        timer = Timer.scheduledTimer(withTimeInterval: 4, repeats: true) { [weak self] _ in
            guard let self else { return }
            self.scroll(to: (self.pageControl.currentPage + 1) % self.images.count)
        }
    }
    private func scroll(to page: Int) {
        collectionView.scrollToItem(at: IndexPath(item: page, section: 0), at: .centeredHorizontally, animated: true)
        pageControl.currentPage = page
    }

    func collectionView(_ cv: UICollectionView, numberOfItemsInSection section: Int) -> Int { images.count }
    func collectionView(_ cv: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = cv.dequeueReusableCell(withReuseIdentifier: "cell", for: indexPath)
        cell.backgroundView = UIImageView(image: images[indexPath.item])
        return cell
    }
    // 手指拖动时暂停，松手后恢复
    func scrollViewWillBeginDragging(_ scrollView: UIScrollView) { timer?.invalidate() }
    func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        pageControl.currentPage = Int(round(scrollView.contentOffset.x / max(scrollView.bounds.width, 1)))
        startAutoPlay()
    }
}
```

export default function Footer() {
  return (
    <footer className="bg-panda-900 text-panda-300 mt-auto dark:bg-panda-900 dark:border-t dark:border-panda-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐼</span>
              <span className="text-xl font-bold text-white">
                Panda<span className="text-bamboo-400">World</span>
              </span>
            </div>
            <p className="text-panda-400 text-sm leading-relaxed max-w-md">
              全球大熊猫直播聚合平台 · 最全熊猫图鉴 · 家族树 · 趣味测试。
              让全世界的熊猫爱好者，在一个地方看遍所有熊猫。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">探索</h3>
            <div className="space-y-2 text-sm">
              <a href="/live" className="block hover:text-white transition-colors">全球直播</a>
              <a href="/pandas" className="block hover:text-white transition-colors">熊猫图鉴</a>
              <a href="/bamboo" className="block hover:text-white transition-colors">熊猫百科</a>
              <a href="/family-tree" className="block hover:text-white transition-colors">家族树</a>
              <a href="/mbti" className="block hover:text-white transition-colors">🐼 MBTI 测试</a>
              <a href="/birthdays" className="block hover:text-white transition-colors">🎂 生日追踪</a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">资源</h3>
            <div className="space-y-2 text-sm">
              <a href="https://www.ipanda.com" target="_blank" rel="noopener noreferrer"
                 className="block hover:text-white transition-colors">iPanda 熊猫频道</a>
              <a href="https://nationalzoo.si.edu/webcams/panda-cam" target="_blank" rel="noopener noreferrer"
                 className="block hover:text-white transition-colors">史密森尼熊猫直播</a>
              <a href="https://www.edinburghzoo.org.uk/webcams/panda-cam/" target="_blank" rel="noopener noreferrer"
                 className="block hover:text-white transition-colors">爱丁堡动物园</a>
              <a href="/about" className="block hover:text-white transition-colors">关于我们</a>
              <a href="/contact" className="block hover:text-white transition-colors">联系我们</a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-3">关注我们</h3>
            <div className="flex items-center gap-3">
              {/* WeChat */}
              <a
                href="#"
                title="微信"
                className="w-9 h-9 rounded-xl bg-panda-800 dark:bg-panda-700 flex items-center justify-center
                           text-green-400 hover:text-green-300 hover:bg-panda-700 dark:hover:bg-panda-600
                           transition-all duration-200 hover:scale-110"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.053 5.032c-2.165 0-4.206.865-5.944 2.388-1.737 1.523-2.698 3.6-2.698 5.845 0 4.282 3.893 7.744 8.642 7.744.762 0 1.514-.117 2.239-.314a.682.682 0 01.563.078l1.494.874a.26.26 0 00.13.043c.127 0 .229-.103.229-.23a.286.286 0 00-.037-.168l-.307-1.16a.463.463 0 01.168-.52C20.303 21.845 22 20.322 22 18.266c0-3.86-3.36-7.005-7.349-7.243zm-3.413 3.67c.504 0 .913.416.913.928a.92.92 0 01-.913.927.92.92 0 01-.913-.927c0-.512.409-.928.913-.928zm4.628 0c.504 0 .913.416.913.928a.92.92 0 01-.913.927.92.92 0 01-.913-.927c0-.512.409-.928.913-.928z"/>
                </svg>
              </a>
              {/* Weibo */}
              <a
                href="#"
                title="微博"
                className="w-9 h-9 rounded-xl bg-panda-800 dark:bg-panda-700 flex items-center justify-center
                           text-red-400 hover:text-red-300 hover:bg-panda-700 dark:hover:bg-panda-600
                           transition-all duration-200 hover:scale-110"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                  <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-3.965-6.645c-.578 2.808 1.055 4.856 3.75 4.461 2.645-.392 4.323-3.067 3.743-5.67-.58-2.604-2.614-4.41-5.068-4.033-2.457.377-3.882 2.558-2.425 5.242zm13.154-2.671c.223-.103.331-.322.199-.559-.364-.743-.877-1.098-1.014-1.655-.158-.64.088-1.196.458-1.196.287 0 .532.277.77.644.338.517.406.572.857.335.223-.103.331-.322.199-.559-.343-.753-.836-1.439-1.316-1.754-.531-.35-1.148-.35-1.606.042-.656.56-.822 1.385-.507 2.011.27.533.652.842.96 1.317.158.242.149.37-.04.457-.193.088-.376-.04-.551-.195-.294-.261-.624-.558-1.076-.558-.687 0-1.064.606-.86 1.29.185.45.678.772 1.108 1.003.228.124.36.262.36.48 0 .172-.177.262-.392.205-.993-.263-2.04-.89-2.04-2.318 0-1.966 1.762-3.266 3.953-3.266 2.111 0 3.88 1.214 3.88 2.92 0 .667-.305 1.086-.732 1.282z"/>
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="w-9 h-9 rounded-xl bg-panda-800 dark:bg-panda-700 flex items-center justify-center
                           text-panda-300 hover:text-white hover:bg-panda-700 dark:hover:bg-panda-600
                           transition-all duration-200 hover:scale-110"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              {/* Twitter/X */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter / X"
                className="w-9 h-9 rounded-xl bg-panda-800 dark:bg-panda-700 flex items-center justify-center
                           text-panda-300 hover:text-white hover:bg-panda-700 dark:hover:bg-panda-600
                           transition-all duration-200 hover:scale-110"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-panda-800 text-center text-sm text-panda-500">
          Made with 🎋 for panda lovers worldwide · © {new Date().getFullYear()} PandaWorld
        </div>
      </div>
    </footer>
  )
}

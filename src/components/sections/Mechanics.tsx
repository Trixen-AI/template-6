import { AutoVideo, BackgroundVideo } from '@/components/webflow/BackgroundVideo'

export function Mechanics() {
  return (
    <section className="section_mechanics">
      <div className="padding-global">
        <div className="container-large">
          <div>
            <p data-w-id="c16cedf1-1d1c-d6c9-4a8a-f3916bdb93fe" className="caption-large text-align-center text-color-alternative">Mechanics</p>
            <div className="text-wrapper_main">
              <h2 data-w-id="c16cedf1-1d1c-d6c9-4a8a-f3916bdb9401" className="h2-v2 text-color-black text-align-center max-740">How Kaia Puts Stablecoins to Work</h2>
              <p data-w-id="c16cedf1-1d1c-d6c9-4a8a-f3916bdb9403" className="p2-v2 margin-0 text-color-black-secondary text-align-center">
                As an EVM-compatible Layer 1, Kaia starts with stablecoin settlement and transforms it into onchain finance and capital markets
              </p>
            </div>
          </div>
          <div className="spacer-xxxhuge" />
          <div className="mechanics_wrapper">
            <div data-w-id="c16cedf1-1d1c-d6c9-4a8a-f3916bdb9407" className="mechanics-card">
              <h3 className="h3-v2 margin-0 text-color-accent">01</h3>
              <div>
                <h5 className="h5-v2">
                  {"Liquidity enters "}
                  <br />
                  onchain at the source
                </h5>
                <p className="p2-v2 text-color-secondary margin-0">Stablecoins enter Kaia directly from everyday apps like LINE, not just crypto-native wallets.</p>
              </div>
            </div>
            <div className="mechanics-card margin-40">
              <h3 className="h3-v2 margin-0 text-color-accent">02</h3>
              <div>
                <h5 className="h5-v2">
                  Funds Move Without
                  <br />
                  Settlement Risk
                </h5>
                <p className="p2-v2 text-color-secondary margin-0">
                  1-second blocks and instant finality on an EVM-compatible Layer 1 network enable exchange flows, FX settlement, and institutional transfers without congestion or settlement risk.
                </p>
              </div>
            </div>
            <div className="mechanics-card margin-80">
              <h3 className="h3-v2 margin-0 text-color-accent">03</h3>
              <div>
                <h5 className="h5-v2">
                  Capital Compounds Into
                  <br />
                  Financial Markets
                </h5>
                <p className="p2-v2 text-color-secondary margin-0">Stablecoins are deployed into DeFi, yield, FX, and tokenized assets on a single execution layer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackgroundVideo data-poster-url="/assets/698909932c5c028e7f1594da_kaia-pg-02_v2_poster.0000000.jpg" data-video-urls="/assets/698909932c5c028e7f1594da_kaia-pg-02_v2_mp4.mp4,/assets/698909932c5c028e7f1594da_kaia-pg-02_v2_webm.webm" data-autoplay="true" data-loop="true" className="bg-video_green hide-mobile-landscape w-background-video w-background-video-atom">
        <AutoVideo autoPlay loop style={{ backgroundImage: "url(\"/assets/698909932c5c028e7f1594da_kaia-pg-02_v2_poster.0000000.jpg\")" }} muted playsInline>
          <source src="/assets/698909932c5c028e7f1594da_kaia-pg-02_v2_mp4.mp4" />
          <source src="/assets/698909932c5c028e7f1594da_kaia-pg-02_v2_webm.webm" />
        </AutoVideo>
      </BackgroundVideo>
      <BackgroundVideo data-poster-url="/assets/698a1a75d0dc205ef327b373_kaia-pg-02_VERT_01_poster.0000000.jpg" data-video-urls="/assets/698a1a75d0dc205ef327b373_kaia-pg-02_VERT_01_mp4.mp4,/assets/698a1a75d0dc205ef327b373_kaia-pg-02_VERT_01_webm.webm" data-autoplay="true" data-loop="true" className="bg-video_green hide-desktop w-background-video w-background-video-atom">
        <AutoVideo autoPlay loop style={{ backgroundImage: "url(\"/assets/698a1a75d0dc205ef327b373_kaia-pg-02_VERT_01_poster.0000000.jpg\")" }} muted playsInline>
          <source src="/assets/698a1a75d0dc205ef327b373_kaia-pg-02_VERT_01_mp4.mp4" />
          <source src="/assets/698a1a75d0dc205ef327b373_kaia-pg-02_VERT_01_webm.webm" />
        </AutoVideo>
      </BackgroundVideo>
      <div className="noice-bg" />
    </section>
  )
}

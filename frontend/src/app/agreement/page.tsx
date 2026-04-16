import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AgreementPage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-primary">
      <Header />

      <main className="flex-1 pt-14">
        <div className="container-custom py-8 max-w-3xl">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">用户协议</h1>
            <p className="text-sm text-text-muted">最后更新：2024年1月1日</p>
          </div>

          {/* Content */}
          <div className="card-dark p-6 space-y-6">
            {/* Section 1 */}
            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">一、服务条款的确认和接受</h2>
              <div className="text-sm text-text-secondary space-y-2">
                <p>1.1 无忧服务平台（以下简称&quot;本平台&quot;）同意按照本协议的规定及其不时发布的操作规则提供基于互联网的手机话费充值、游戏点卡充值等服务。</p>
                <p>1.2 用户在使用本平台服务之前，应认真阅读本协议。用户使用本平台服务即表示用户与本平台已达成协议，自愿接受本协议的所有内容。</p>
                <p>1.3 本平台有权随时修改本协议的任何内容，修改后的协议一经公布即有效代替原来的协议。用户在使用服务前，应及时查阅最新版协议。</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">二、服务内容</h2>
              <div className="text-sm text-text-secondary space-y-2">
                <p>2.1 本平台服务的具体内容由本平台根据实际情况提供，包括但不限于：</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>手机话费充值服务</li>
                  <li>游戏点卡充值服务</li>
                  <li>视频平台会员充值服务</li>
                  <li>社交平台充值服务</li>
                  <li>其他增值服务</li>
                </ul>
                <p>2.2 本平台保留随时变更、中断或终止部分或全部服务的权利。</p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">三、充值说明</h2>
              <div className="text-sm text-text-secondary space-y-2">
                <p>3.1 充值成功后，系统将自动发送卡密至用户账户，用户可前往&quot;我的订单&quot;查看卡密信息。</p>
                <p>3.2 请务必妥善保管卡密信息，因用户个人原因导致卡密泄露造成的损失，由用户自行承担。</p>
                <p>3.3 虚拟商品一经充值成功，概不退换。如因系统原因导致充值失败，用户可申请退款。</p>
                <p>3.4 充值金额以本平台标注价格为准，不接受任何形式的议价。</p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">四、用户行为规范</h2>
              <div className="text-sm text-text-secondary space-y-2">
                <p>4.1 用户在使用本平台服务时，应遵守中华人民共和国相关法律法规，不得利用本平台从事任何违法活动。</p>
                <p>4.2 用户不得利用本平台进行以下行为：</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>危害国家安全、泄露国家秘密</li>
                  <li>损害国家荣誉和利益</li>
                  <li>煽动民族仇恨、民族歧视</li>
                  <li>破坏宗教政策</li>
                  <li>散布谣言、扰乱社会秩序</li>
                  <li>其他违法违规行为</li>
                </ul>
                <p>4.3 如用户违反上述规定，本平台有权采取一切必要措施，包括但不限于：暂停服务、注销账号、追究法律责任。</p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">五、隐私保护</h2>
              <div className="text-sm text-text-secondary space-y-2">
                <p>5.1 本平台尊重用户的个人隐私，承诺保护用户的个人信息安全。</p>
                <p>5.2 本平台收集用户信息的目的是为了向用户提供更好的服务，包括：订单处理、售后服务、客户回访等。</p>
                <p>5.3 未经用户同意，本平台不会向第三方公开、转让、出租、出售用户的个人信息。</p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">六、免责声明</h2>
              <div className="text-sm text-text-secondary space-y-2">
                <p>6.1 由于不可抗力因素（包括但不限于：地震、洪水、火灾、战争、政府行为等）导致的损失，本平台不承担责任。</p>
                <p>6.2 因网络运营商原因导致的网络故障、充值延迟等问题，本平台不承担责任。</p>
                <p>6.3 用户因自身操作失误（包括但不限于：输入错误的充值号码、选错充值金额等）导致的损失，由用户自行承担。</p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">七、附则</h2>
              <div className="text-sm text-text-secondary space-y-2">
                <p>7.1 本协议的订立、执行和解释均适用中华人民共和国法律。</p>
                <p>7.2 如本协议中的任何条款与中华人民共和国法律相抵触，则该条款将按法律规定重新解释，而其他条款仍然有效。</p>
                <p>7.3 本协议未尽事宜，本平台保留最终解释权。</p>
              </div>
            </section>

            {/* Back Link */}
            <div className="pt-4 border-t border-dark-border">
              <Link href="/" className="text-accent hover:text-accent-hover transition-colors">
                &lt; 返回首页
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

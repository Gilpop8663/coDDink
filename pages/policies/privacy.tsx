import React from 'react';
import HeadMeta from '@components/headMeta';

function Privacy() {
  return (
    <div>
      <HeadMeta></HeadMeta>
      <h1 className="mt-8 flex justify-center text-2xl">개인정보취급방침</h1>

      <div className="mt-8 px-4">
        <h3 className="text-xl">coDDink 개인정보취급방침</h3>

        <p className="mt-8 text-base">
          coDDink는 『정보통신망 이용촉진 및 정보보호 등에 관한 법률』,
          『개인정보보호법』, 『통신비밀보호법』, 『전기통신사업법』 등
          정보통신서비스제공자가 준수하여야 할 관련 법령 상의 개인정보보호
          규정을 준수하며 최소한의 정보만을 필요한 시점에 수집하고, 수집하는
          정보는 고지한 범위 내에서만 사용하며, 사전 동의 없이 그 범위를
          초과하여 이용하거나 외부에 공개하지 않는 등 회원의 권익 보호에 최선을
          다하고 있습니다. 회사는 개인정보취급방침을 통하여 회원이 제공하는
          개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해
          어떠한 조치가 취해지고 있는지 알려드리고 개인정보취급방침을 개정하는
          경우 개정 이유 및 내용에 관하여 웹사이트 및 전자우편 등을 통하여
          고지합니다. 회사는 아래와 같이 개인정보를 보호하고 있습니다.
        </p>

        <h4 className="mt-8 text-lg font-semibold">
          1. 회사는 이용하는 서비스의 형태에 따라 다음과 같은 개인정보를 수집 및
          이용∙제공∙파기하고 있습니다.
        </h4>
        <li className="mt-8">
          필수 수집 정보 : 서비스 아이디, 비밀번호, 닉네임, 이메일, 전화번호
        </li>
        <h4 className="mt-8 text-lg font-semibold">
          2. 개인정보의 수집 및 이용 목적 – 회사는 필요한 목적 범위 내에서만
          개인정보를 이용하고 있습니다.
        </h4>

        <ul className="mt-8">
          <li>
            가. 서비스의 기본 기능의 제공
            <ul>
              <li className="mt-8">
                회사는 회원의 로그인, 콘텐츠 감상 등 기본적인 기능을 제공하기
                위하여 회원의 개인정보를 이용합니다.
              </li>
            </ul>
          </li>
          <li className="mt-8">
            나. 회원관리
            <ul>
              <li className="mt-8">
                회사는 회원의 본인확인, 회원 식별, 콘텐츠 접근 권한의 차등 적용,
                고객 문의에 대한 회신, 각종 고지 사항 전달, 불량회원 제한,
                부정이용방지, 분쟁 조정을 위한 기록 보존 등의 목적으로 회원의
                개인정보를 이용합니다.
              </li>
            </ul>
          </li>
          <li className="mt-8">
            다. 사용자 경험 향상 및 마케팅ᆞ광고에의 활용
            <ul>
              <li className="mt-8">
                회사는 지속적으로 사용자의 경험을 높이기 위해서 새로운 서비스를
                개발하고,새로운 기능, 추천서비스, 기존 기능 개선, 각종 이벤트나
                광고성 정보를 제공합니다.
              </li>
            </ul>
          </li>
          <li className="mt-8">
            라. 법령 및 약관 등의 이행 및 준수
            <ul>
              <li className="mt-8">
                회사는 법령이나 이용약관 등에 반하여 피해를 줄 수 있는 부분을
                방지하기 위해서 정보로 수집된 정보들을 활용할 수 있습니다.
              </li>
            </ul>
          </li>
        </ul>

        <h3 className="mt-8 text-lg font-semibold">
          3. 원칙적으로 회사는 수집한 회원의 개인정보에 대해 보관해야 되는
          목적이 달성된 후, 즉시 해당 개인정보를 파기하고 있습니다.
        </h3>

        <span className="mt-8">
          개인정보의 파기 절차, 기한 및 방법은 다음과 같습니다.
        </span>

        <ul className="mt-8">
          <li>
            파기절차수집•이용목적이 달성된 개인정보의 경우 별도의 DB에 옮겨져
            내부규정 및 관련 법령을 준수하여 안전하게 보관되며, 정해진 기간이
            종료되었을 때, 지체없이 파기됩니다. 이 때, 별도의 DB로 옮겨진
            개인정보는 여러분 각자가 동의한 목적을 초과하거나 법률에 정한 경우가
            아니고서는 다른 목적으로 이용되지 않습니다.
          </li>
          <li className="mt-8">
            파기방법
            <ul>
              <li className="mt-8">
                전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을
                사용하여 삭제합니다.
              </li>
              <li className="mt-8">
                종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여
                파기합니다.
              </li>
            </ul>
          </li>
        </ul>

        <h3 className="mt-8 text-lg font-semibold">
          4. 회사는 사용자들의 안정적인 정보보호를 다양한 노력을 하고 있습니다.
        </h3>

        <span className="mt-8">
          사용자들은 언제든지 개인정보를 조회하고 수정할 수 있으며, 수집,이용에
          대한 동의 철회 또는 가입 탈퇴를 요청하실 수 있습니다. 서비스 설정에서
          이러한 요청을 할 수 있게 도와드리고 있고, 원활한 기능이 없거나 부족한
          경우에는 고객센터를 통해서 연락주시면 그 즉시 처리해드리고 있습니다.
        </span>

        <h3 className="mt-8 text-lg font-semibold">
          5. 혹시 더 궁금하신 부분이 있으신가요?
        </h3>

        <span className="mt-8">
          혹시 더 궁금하신 부분이 있으시다면 언제든지 개인 정보 보호 책임부서로
          연락주시면 그 즉시 사용자의 소리에 귀 기울이고 충분한 답변을 드릴 수
          있도록 최선을 다하겠습니다.
        </span>

        <ul className="mt-8">
          <li className="mt-8">
            개인정보보호 책임자
            <ul className="mt-8">
              <li className="mt-8">성명 : 김영길</li>
              <li className="mt-8">연락처: wolfye0611@gmail.com</li>
            </ul>
          </li>
          <li className="mt-8">
            기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에
            문의하시기 바랍니다.
            <ul>
              <li className="mt-8">
                개인정보침해신고센터 (http://www.118.or.kr / 국번 없이 118)
              </li>
              <li className="mt-8">
                대검찰청 사이버범죄수사단 (http://www.spo.go.kr / 02-3480-2000)
              </li>
              <li className="mt-8">
                경찰청 사이버테러대응센터 (http://www.ctrc.go.kr / 1566-0112)
              </li>
            </ul>
          </li>
        </ul>

        <h3 className="mt-8 text-lg font-semibold">
          6. 만약 개인정보 처리방침이 변경된다면 그 즉시 사용자 여러분들께 가장
          먼저 알려드리겠습니다.
        </h3>

        <span className="mt-8">
          서비스를 개선하면서 변경사항이 생길 수 있습니다. 그럴 경우 목적에 따라
          개인정보 취급방침을 수정할 수 있습니다. 이렇게 변경될 경우,회사는 변경
          사항을 게시하며, 변경된 게시정보처리방침은 게시한 날로부터 7일 이후에
          효력이 발생하게 됩니다. 하지만 사용자의 권리에 중요한 변경이 있을
          경우에는 변경될 내용을 30일 이전에 미리 알려드리겠습니다.
        </span>

        <ul className="mt-8">
          <li className="mt-8">공고일자 : 2022년 9월 20일</li>
          <li className="mt-8 pb-32">시행일자 : 2022년 9월 20일</li>
        </ul>
      </div>
    </div>
  );
}

export default Privacy;

import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import useSWR from 'swr';
import useMutation from '@libs/client/useMutation';
import useUser from '@libs/client/useUser';
import { makeImageURL } from '@libs/client/utils';
import Button from '@components/common/Button';
import ErrorMessage from '@components/common/ErrorMessage';
import Input from '@components/common/Input';
import Layout from '@components/common/Layout';
import HeadMeta from '@components/headMeta';
import CategoryTabMenu from '@components/profile/categoryTabMenu';
import ProfileWeb from '@components/profile/profileWeb';
import TextArea from '@components/textArea';
import UploadButton from '@components/uploadButton';

interface LocationResponse {
  ok: boolean;
  parseContent: {
    country: any;
    states: any;
  };
}

export interface FormProps {
  name: string;
  job?: string;
  company?: string;
  location: string;
  country?: string;
  URL?: string;
  introduce?: string;
  city?: string;
  Facebook?: string;
  Youtube?: string;
  Github?: string;
  Twitter?: string;
  Instagram?: string;
  LinkedIn?: string;
  Twitch?: string;
  Dribble?: string;
  avatar?: FileList;
}

interface StatesProps {
  name: string;
  code: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProfileEditor: NextPage = () => {
  const { user } = useUser();
  const { mutate } = useSWR('');
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormProps>();

  const [avatarPreveiw, setAvatarPreview] = useState('');

  const [isChange, setIsChange] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [countryName, setCountryName] = useState('');
  const [cityData, setCityData] = useState<StatesProps[]>([]);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [updateProfile, { loading }] = useMutation('/api/profile');
  const [isSave, setIsSave] = useState(false);

  const avatar = watch('avatar');

  const onValid = async (value: FormProps) => {
    if (loading) return;
    setIsSave(true);
    const newValue = { ...value, country: countryName, city: cityName };
    if (value.avatar && value.avatar.length > 0 && user) {
      const { uploadURL } = await (await fetch('/api/files')).json();
      const form = new FormData();
      form.append('file', value.avatar[0], user?.id.toString());
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: 'POST',
          body: form,
        })
      ).json();

      updateProfile({ newValue, avatarId: id });
    } else {
      updateProfile(newValue);
    }
    mutate();
    setTimeout(() => {
      setIsSave(false);
    }, 3000);
  };

  const { data: locationData } = useSWR<LocationResponse>(
    '/api/location',
    fetcher
  );

  const onCountryClick = () => {
    setIsChange((prev) => !prev);
  };

  const cityName = watch('city');
  const isCol = cityData && cityData?.find((item) => item.name === cityName);

  const handleFollow = () => {
    setScrollY(window.pageYOffset); // window 스크롤 값을 ScrollY에 저장
  };

  const onHeightClick = (height: number) => {
    window.scrollTo({
      top: height,
      behavior: 'smooth',
    });
    setScrollY(height);
  };

  const facebookWD = watch('Facebook');
  const youtubeWD = watch('Youtube');
  const dribbleWD = watch('Dribble');
  const githubWD = watch('Github');
  const instagramWD = watch('Instagram');
  const linkedInWD = watch('LinkedIn');
  const twitchWD = watch('Twitch');
  const twitterWD = watch('Twitter');

  useEffect(() => {
    const watch = () => {
      window.addEventListener('scroll', handleFollow);
    };
    watch(); // addEventListener 함수를 실행
    return () => {
      window.removeEventListener('scroll', handleFollow); // addEventListener 함수를 삭제
    };
  }, []);

  useEffect(() => {
    if (user?.name) setValue('name', user?.name);
    if (user?.job) setValue('job', user?.job);
    if (user?.company) setValue('company', user?.company);
    if (user?.country) setValue('country', user?.country);
    if (user?.city) setValue('city', user?.city);
    if (user?.URL) setValue('URL', user?.URL);
    if (user?.introduce) setValue('introduce', user?.introduce);
    if (user?.Facebook) setValue('Facebook', user?.Facebook);
    if (user?.Youtube) setValue('Youtube', user?.Youtube);
    if (user?.Github) setValue('Github', user?.Github);
    if (user?.Twitter) setValue('Twitter', user?.Twitter);
    if (user?.Instagram) setValue('Instagram', user?.Instagram);
    if (user?.LinkedIn) setValue('LinkedIn', user?.LinkedIn);
    if (user?.Twitch) setValue('Twitch', user?.Twitch);
    if (user?.Dribble) setValue('Dribble', user?.Dribble);
    if (user?.avatar) setAvatarPreview(makeImageURL(user?.avatar, 'bigAvatar'));
  }, [user, setValue]);

  useEffect(() => {
    if (
      !Boolean(isCol) &&
      typeof cityName !== typeof undefined &&
      cityName !== ''
    ) {
      setError('city', { message: 'City은 유효한 도시여야 합니다.' });
    } else {
      clearErrors('city');
    }
  }, [cityName, setError, isCol, clearErrors]);

  useEffect(() => {
    if (!selectRef.current) return;
    let countryIdx = selectRef.current && selectRef?.current.selectedIndex;

    if (countryIdx === 0) {
      setError('country', { message: '이 필드는 반드시 입력해야 합니다.' });
      setValue('city', '');
    } else {
      clearErrors('country');
    }
    let countryCode =
      selectRef?.current &&
      countryIdx &&
      selectRef?.current[countryIdx].getAttribute('data-code');

    let cityObj =
      countryCode && locationData?.parseContent?.states[countryCode];

    let cityData = cityObj && Object.values(cityObj);
    setCityData(cityData);
    setCountryName(selectRef.current.value);
  }, [isChange, locationData?.parseContent?.states]);

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

  return (
    <Layout isLogin={true} profile={user} userId={user?.id}>
      <HeadMeta></HeadMeta>
      <form onSubmit={handleSubmit(onValid)}>
        <div className="fixed z-10 flex h-16 w-screen items-center justify-center space-x-4 bg-white shadow-sm">
          <Link href={`/profile/${user?.id}`}>
            <a className="w-40">
              <Button
                size="sm"
                color="green"
                type="button"
                text="프로필로 돌아가기"
              />
            </a>
          </Link>
          <div className="w-40">
            <Button size="sm" color="blue" text="저장하기" />
          </div>
          <div className="absolute flex justify-center text-xs">
            <span className="relative left-64">
              {isSave ? '변경 내용이 저장되었습니다.' : ''}
            </span>
          </div>
        </div>
        <div className=" flex justify-center bg-slate-100 px-6 pt-28 pb-96 lg:px-28 ">
          <div className="fixed hidden lg:flex">
            <div className="relative right-80 flex flex-col border">
              <CategoryTabMenu
                onClick={() => onHeightClick(0)}
                isWatch={scrollY <= 500}
                label="기본 정보"
              />
              <CategoryTabMenu
                onClick={() => onHeightClick(510)}
                isWatch={scrollY > 500 && scrollY <= 800}
                label="내 소개"
              />
              <CategoryTabMenu
                onClick={() => onHeightClick(810)}
                isWatch={scrollY > 800 && scrollY <= 1055}
                label="웹"
              />
            </div>
          </div>
          <div className="relative flex flex-col space-y-6 lg:left-40 lg:ml-6">
            <div>
              <div className="border bg-white p-4 lg:p-8">
                <h6 className="text-sm font-semibold">기본 정보</h6>
                <div className="mt-2 flex">
                  <UploadButton
                    previewImage={avatarPreveiw}
                    register={register('avatar')}
                    kind="profile"
                  ></UploadButton>
                  <div className="flex flex-col px-2 lg:px-8">
                    <Input
                      register={register('name', {
                        required: '이 필드는 반드시 입력해야 합니다.',
                        minLength: {
                          value: 2,
                          message: '너무 짧습니다.',
                        },
                        maxLength: {
                          value: 20,
                          message: '너무 깁니다.',
                        },
                      })}
                      minLength={2}
                      maxLength={20}
                      name="name"
                      label="이름"
                      type="text"
                    ></Input>
                    {errors.name && <ErrorMessage text={errors.name.message} />}
                    <Input
                      register={register('job', {
                        maxLength: {
                          value: 30,
                          message: '너무 깁니다.',
                        },
                      })}
                      maxLength={30}
                      name="job"
                      label="직업"
                      type="text"
                    ></Input>
                    {errors.job && <ErrorMessage text={errors.job.message} />}
                    <Input
                      register={register('company', {
                        maxLength: {
                          value: 30,
                          message: '너무 깁니다.',
                        },
                      })}
                      maxLength={30}
                      name="company"
                      label="회사"
                      type="text"
                    ></Input>
                    {errors.company && (
                      <ErrorMessage text={errors.company.message} />
                    )}

                    <div className="flex flex-col">
                      <label
                        htmlFor="country"
                        className="mt-4 text-xs text-gray-700"
                      >
                        위치
                      </label>
                      <div className="mt-4">
                        <select
                          onClick={onCountryClick}
                          ref={selectRef}
                          id="country"
                          name="country"
                          aria-disabled="false"
                          className="mr-2 w-48 p-1 text-sm"
                          defaultValue={'Korea, Republic of'}
                        >
                          <option value="">모든 국가/지역</option>
                          <option data-code="US" value="United States">
                            United States
                          </option>
                          <option data-code="AF" value="Afghanistan">
                            Afghanistan
                          </option>
                          <option data-code="AX" value="Aland Islands">
                            Aland Islands
                          </option>
                          <option data-code="AL" value="Albania">
                            Albania
                          </option>
                          <option data-code="DZ" value="Algeria">
                            Algeria
                          </option>
                          <option data-code="AS" value="American Samoa">
                            American Samoa
                          </option>
                          <option data-code="AD" value="Andorra">
                            Andorra
                          </option>
                          <option data-code="AO" value="Angola">
                            Angola
                          </option>
                          <option data-code="AI" value="Anguilla">
                            Anguilla
                          </option>
                          <option data-code="AQ" value="Antarctica">
                            Antarctica
                          </option>
                          <option data-code="AG" value="Antigua and Barbuda">
                            Antigua and Barbuda
                          </option>
                          <option data-code="AR" value="Argentina">
                            Argentina
                          </option>
                          <option data-code="AM" value="Armenia">
                            Armenia
                          </option>
                          <option data-code="AW" value="Aruba">
                            Aruba
                          </option>
                          <option data-code="AU" value="Australia">
                            Australia
                          </option>
                          <option data-code="AT" value="Austria">
                            Austria
                          </option>
                          <option data-code="AZ" value="Azerbaijan">
                            Azerbaijan
                          </option>
                          <option data-code="BS" value="Bahamas">
                            Bahamas
                          </option>
                          <option data-code="BH" value="Bahrain">
                            Bahrain
                          </option>
                          <option data-code="BD" value="Bangladesh">
                            Bangladesh
                          </option>
                          <option data-code="BB" value="Barbados">
                            Barbados
                          </option>
                          <option data-code="BY" value="Belarus">
                            Belarus
                          </option>
                          <option data-code="BE" value="Belgium">
                            Belgium
                          </option>
                          <option data-code="BZ" value="Belize">
                            Belize
                          </option>
                          <option data-code="BJ" value="Benin">
                            Benin
                          </option>
                          <option data-code="BM" value="Bermuda">
                            Bermuda
                          </option>
                          <option data-code="BT" value="Bhutan">
                            Bhutan
                          </option>
                          <option data-code="BO" value="Bolivia">
                            Bolivia
                          </option>
                          <option
                            data-code="BQ"
                            value="Bonaire, Saint Eustatius and Saba"
                          >
                            Bonaire, Saint Eustatius and Saba
                          </option>
                          <option data-code="BA" value="Bosnia and Herzegovina">
                            Bosnia and Herzegovina
                          </option>
                          <option data-code="BW" value="Botswana">
                            Botswana
                          </option>
                          <option data-code="BR" value="Brazil">
                            Brazil
                          </option>
                          <option
                            data-code="IO"
                            value="British Indian Ocean Territory"
                          >
                            British Indian Ocean Territory
                          </option>
                          <option data-code="BN" value="Brunei Darussalam">
                            Brunei Darussalam
                          </option>
                          <option data-code="BG" value="Bulgaria">
                            Bulgaria
                          </option>
                          <option data-code="BF" value="Burkina Faso">
                            Burkina Faso
                          </option>
                          <option data-code="BI" value="Burundi">
                            Burundi
                          </option>
                          <option data-code="KH" value="Cambodia">
                            Cambodia
                          </option>
                          <option data-code="CM" value="Cameroon">
                            Cameroon
                          </option>
                          <option data-code="CA" value="Canada">
                            Canada
                          </option>
                          <option data-code="CV" value="Cape Verde">
                            Cape Verde
                          </option>
                          <option data-code="KY" value="Cayman Islands">
                            Cayman Islands
                          </option>
                          <option
                            data-code="CF"
                            value="Central African Republic"
                          >
                            Central African Republic
                          </option>
                          <option data-code="TD" value="Chad">
                            Chad
                          </option>
                          <option data-code="CL" value="Chile">
                            Chile
                          </option>
                          <option data-code="CN" value="China">
                            China
                          </option>
                          <option data-code="CX" value="Christmas Island">
                            Christmas Island
                          </option>
                          <option
                            data-code="CC"
                            value="Cocos (Keeling) Islands"
                          >
                            Cocos (Keeling) Islands
                          </option>
                          <option data-code="CO" value="Colombia">
                            Colombia
                          </option>
                          <option data-code="KM" value="Comoros">
                            Comoros
                          </option>
                          <option data-code="CG" value="Congo">
                            Congo
                          </option>
                          <option
                            data-code="CD"
                            value="Congo, The Democratic Republic of the"
                          >
                            Congo, The Democratic Republic of the
                          </option>
                          <option data-code="CK" value="Cook Islands">
                            Cook Islands
                          </option>
                          <option data-code="CR" value="Costa Rica">
                            Costa Rica
                          </option>
                          <option data-code="CI" value="Cote d'Ivoire">
                            {`Cote d'Ivoire`}
                          </option>
                          <option data-code="HR" value="Croatia">
                            Croatia
                          </option>
                          <option data-code="CU" value="Cuba">
                            Cuba
                          </option>
                          <option data-code="CW" value="Curacao">
                            Curacao
                          </option>
                          <option data-code="CY" value="Cyprus">
                            Cyprus
                          </option>
                          <option data-code="CZ" value="Czech Republic">
                            Czech Republic
                          </option>
                          <option data-code="DK" value="Denmark">
                            Denmark
                          </option>
                          <option data-code="DJ" value="Djibouti">
                            Djibouti
                          </option>
                          <option data-code="DM" value="Dominica">
                            Dominica
                          </option>
                          <option data-code="DO" value="Dominican Republic">
                            Dominican Republic
                          </option>
                          <option data-code="EC" value="Ecuador">
                            Ecuador
                          </option>
                          <option data-code="EG" value="Egypt">
                            Egypt
                          </option>
                          <option data-code="SV" value="El Salvador">
                            El Salvador
                          </option>
                          <option data-code="GQ" value="Equatorial Guinea">
                            Equatorial Guinea
                          </option>
                          <option data-code="ER" value="Eritrea">
                            Eritrea
                          </option>
                          <option data-code="EE" value="Estonia">
                            Estonia
                          </option>
                          <option data-code="ET" value="Ethiopia">
                            Ethiopia
                          </option>
                          <option
                            data-code="FK"
                            value="Falkland Islands (Malvinas)"
                          >
                            Falkland Islands (Malvinas)
                          </option>
                          <option data-code="FO" value="Faroe Islands">
                            Faroe Islands
                          </option>
                          <option data-code="FJ" value="Fiji">
                            Fiji
                          </option>
                          <option data-code="FI" value="Finland">
                            Finland
                          </option>
                          <option data-code="FR" value="France">
                            France
                          </option>
                          <option data-code="GF" value="French Guiana">
                            French Guiana
                          </option>
                          <option data-code="PF" value="French Polynesia">
                            French Polynesia
                          </option>
                          <option
                            data-code="TF"
                            value="French Southern Territories"
                          >
                            French Southern Territories
                          </option>
                          <option data-code="GA" value="Gabon">
                            Gabon
                          </option>
                          <option data-code="GM" value="Gambia">
                            Gambia
                          </option>
                          <option data-code="GE" value="Georgia">
                            Georgia
                          </option>
                          <option data-code="DE" value="Germany">
                            Germany
                          </option>
                          <option data-code="GH" value="Ghana">
                            Ghana
                          </option>
                          <option data-code="GI" value="Gibraltar">
                            Gibraltar
                          </option>
                          <option data-code="GR" value="Greece">
                            Greece
                          </option>
                          <option data-code="GL" value="Greenland">
                            Greenland
                          </option>
                          <option data-code="GD" value="Grenada">
                            Grenada
                          </option>
                          <option data-code="GP" value="Guadeloupe">
                            Guadeloupe
                          </option>
                          <option data-code="GU" value="Guam">
                            Guam
                          </option>
                          <option data-code="GT" value="Guatemala">
                            Guatemala
                          </option>
                          <option data-code="GG" value="Guernsey">
                            Guernsey
                          </option>
                          <option data-code="GN" value="Guinea">
                            Guinea
                          </option>
                          <option data-code="GW" value="Guinea-Bissau">
                            Guinea-Bissau
                          </option>
                          <option data-code="GY" value="Guyana">
                            Guyana
                          </option>
                          <option data-code="HT" value="Haiti">
                            Haiti
                          </option>
                          <option
                            data-code="VA"
                            value="Holy See (Vatican City State)"
                          >
                            Holy See (Vatican City State)
                          </option>
                          <option data-code="HN" value="Honduras">
                            Honduras
                          </option>
                          <option data-code="HK" value="Hong Kong SAR of China">
                            Hong Kong SAR of China
                          </option>
                          <option data-code="HU" value="Hungary">
                            Hungary
                          </option>
                          <option data-code="IS" value="Iceland">
                            Iceland
                          </option>
                          <option data-code="IN" value="India">
                            India
                          </option>
                          <option data-code="ID" value="Indonesia">
                            Indonesia
                          </option>
                          <option
                            data-code="IR"
                            value="Iran, Islamic Republic of"
                          >
                            Iran, Islamic Republic of
                          </option>
                          <option data-code="IQ" value="Iraq">
                            Iraq
                          </option>
                          <option data-code="IE" value="Ireland">
                            Ireland
                          </option>
                          <option data-code="IM" value="Isle of Man">
                            Isle of Man
                          </option>
                          <option data-code="IL" value="Israel">
                            Israel
                          </option>
                          <option data-code="IT" value="Italy">
                            Italy
                          </option>
                          <option data-code="JM" value="Jamaica">
                            Jamaica
                          </option>
                          <option data-code="JP" value="Japan">
                            Japan
                          </option>
                          <option data-code="JE" value="Jersey">
                            Jersey
                          </option>
                          <option data-code="JO" value="Jordan">
                            Jordan
                          </option>
                          <option data-code="KZ" value="Kazakhstan">
                            Kazakhstan
                          </option>
                          <option data-code="KE" value="Kenya">
                            Kenya
                          </option>
                          <option data-code="KI" value="Kiribati">
                            Kiribati
                          </option>
                          <option
                            data-code="KP"
                            value="Korea, Democratic People's Republic of"
                          >
                            {`Korea, Democratic People's Republic of`}
                          </option>
                          <option data-code="KR" value="Korea, Republic of">
                            Korea, Republic of
                          </option>
                          <option data-code="XK" value="Kosovo">
                            Kosovo
                          </option>
                          <option data-code="KW" value="Kuwait">
                            Kuwait
                          </option>
                          <option data-code="KG" value="Kyrgyzstan">
                            Kyrgyzstan
                          </option>
                          <option
                            data-code="LA"
                            value="Lao People's Democratic Republic"
                          >
                            {`Lao People's Democratic Republic`}
                          </option>
                          <option data-code="LV" value="Latvia">
                            Latvia
                          </option>
                          <option data-code="LB" value="Lebanon">
                            Lebanon
                          </option>
                          <option data-code="LS" value="Lesotho">
                            Lesotho
                          </option>
                          <option data-code="LR" value="Liberia">
                            Liberia
                          </option>
                          <option data-code="LY" value="Libya">
                            Libya
                          </option>
                          <option data-code="LI" value="Liechtenstein">
                            Liechtenstein
                          </option>
                          <option data-code="LT" value="Lithuania">
                            Lithuania
                          </option>
                          <option data-code="LU" value="Luxembourg">
                            Luxembourg
                          </option>
                          <option data-code="MO" value="Macau SAR of China">
                            Macau SAR of China
                          </option>
                          <option data-code="MG" value="Madagascar">
                            Madagascar
                          </option>
                          <option data-code="MW" value="Malawi">
                            Malawi
                          </option>
                          <option data-code="MY" value="Malaysia">
                            Malaysia
                          </option>
                          <option data-code="MV" value="Maldives">
                            Maldives
                          </option>
                          <option data-code="ML" value="Mali">
                            Mali
                          </option>
                          <option data-code="MT" value="Malta">
                            Malta
                          </option>
                          <option data-code="MH" value="Marshall Islands">
                            Marshall Islands
                          </option>
                          <option data-code="MQ" value="Martinique">
                            Martinique
                          </option>
                          <option data-code="MR" value="Mauritania">
                            Mauritania
                          </option>
                          <option data-code="MU" value="Mauritius">
                            Mauritius
                          </option>
                          <option data-code="YT" value="Mayotte">
                            Mayotte
                          </option>
                          <option data-code="MX" value="Mexico">
                            Mexico
                          </option>
                          <option
                            data-code="FM"
                            value="Micronesia, Federated States of"
                          >
                            Micronesia, Federated States of
                          </option>
                          <option data-code="MD" value="Moldova, Republic of">
                            Moldova, Republic of
                          </option>
                          <option data-code="MC" value="Monaco">
                            Monaco
                          </option>
                          <option data-code="MN" value="Mongolia">
                            Mongolia
                          </option>
                          <option data-code="ME" value="Montenegro">
                            Montenegro
                          </option>
                          <option data-code="MS" value="Montserrat">
                            Montserrat
                          </option>
                          <option data-code="MA" value="Morocco">
                            Morocco
                          </option>
                          <option data-code="MZ" value="Mozambique">
                            Mozambique
                          </option>
                          <option data-code="MM" value="Myanmar">
                            Myanmar
                          </option>
                          <option data-code="NA" value="Namibia">
                            Namibia
                          </option>
                          <option data-code="NR" value="Nauru">
                            Nauru
                          </option>
                          <option data-code="NP" value="Nepal">
                            Nepal
                          </option>
                          <option data-code="NL" value="Netherlands">
                            Netherlands
                          </option>
                          <option data-code="NC" value="New Caledonia">
                            New Caledonia
                          </option>
                          <option data-code="NZ" value="New Zealand">
                            New Zealand
                          </option>
                          <option data-code="NI" value="Nicaragua">
                            Nicaragua
                          </option>
                          <option data-code="NE" value="Niger">
                            Niger
                          </option>
                          <option data-code="NG" value="Nigeria">
                            Nigeria
                          </option>
                          <option data-code="NU" value="Niue">
                            Niue
                          </option>
                          <option data-code="NF" value="Norfolk Island">
                            Norfolk Island
                          </option>
                          <option data-code="MK" value="North Macedonia">
                            North Macedonia
                          </option>
                          <option
                            data-code="MP"
                            value="Northern Mariana Islands"
                          >
                            Northern Mariana Islands
                          </option>
                          <option data-code="NO" value="Norway">
                            Norway
                          </option>
                          <option data-code="OM" value="Oman">
                            Oman
                          </option>
                          <option data-code="PK" value="Pakistan">
                            Pakistan
                          </option>
                          <option data-code="PW" value="Palau">
                            Palau
                          </option>
                          <option data-code="PS" value="Palestinian Territory">
                            Palestinian Territory
                          </option>
                          <option data-code="PA" value="Panama">
                            Panama
                          </option>
                          <option data-code="PG" value="Papua New Guinea">
                            Papua New Guinea
                          </option>
                          <option data-code="PY" value="Paraguay">
                            Paraguay
                          </option>
                          <option data-code="PE" value="Peru">
                            Peru
                          </option>
                          <option data-code="PH" value="Philippines">
                            Philippines
                          </option>
                          <option data-code="PN" value="Pitcairn">
                            Pitcairn
                          </option>
                          <option data-code="PL" value="Poland">
                            Poland
                          </option>
                          <option data-code="PT" value="Portugal">
                            Portugal
                          </option>
                          <option data-code="PR" value="Puerto Rico">
                            Puerto Rico
                          </option>
                          <option data-code="QA" value="Qatar">
                            Qatar
                          </option>
                          <option data-code="RE" value="Reunion">
                            Reunion
                          </option>
                          <option data-code="RO" value="Romania">
                            Romania
                          </option>
                          <option data-code="RU" value="Russian Federation">
                            Russian Federation
                          </option>
                          <option data-code="RW" value="Rwanda">
                            Rwanda
                          </option>
                          <option data-code="BL" value="Saint Bartelemey">
                            Saint Bartelemey
                          </option>
                          <option data-code="SH" value="Saint Helena">
                            Saint Helena
                          </option>
                          <option data-code="KN" value="Saint Kitts and Nevis">
                            Saint Kitts and Nevis
                          </option>
                          <option data-code="LC" value="Saint Lucia">
                            Saint Lucia
                          </option>
                          <option data-code="MF" value="Saint Martin">
                            Saint Martin
                          </option>
                          <option
                            data-code="PM"
                            value="Saint Pierre and Miquelon"
                          >
                            Saint Pierre and Miquelon
                          </option>
                          <option
                            data-code="VC"
                            value="Saint Vincent and the Grenadines"
                          >
                            Saint Vincent and the Grenadines
                          </option>
                          <option data-code="WS" value="Samoa">
                            Samoa
                          </option>
                          <option data-code="SM" value="San Marino">
                            San Marino
                          </option>
                          <option data-code="ST" value="Sao Tome and Principe">
                            Sao Tome and Principe
                          </option>
                          <option data-code="SA" value="Saudi Arabia">
                            Saudi Arabia
                          </option>
                          <option data-code="SN" value="Senegal">
                            Senegal
                          </option>
                          <option data-code="RS" value="Serbia">
                            Serbia
                          </option>
                          <option data-code="SC" value="Seychelles">
                            Seychelles
                          </option>
                          <option data-code="SL" value="Sierra Leone">
                            Sierra Leone
                          </option>
                          <option data-code="SG" value="Singapore">
                            Singapore
                          </option>
                          <option data-code="SX" value="Sint Maarten">
                            Sint Maarten
                          </option>
                          <option data-code="SK" value="Slovakia">
                            Slovakia
                          </option>
                          <option data-code="SI" value="Slovenia">
                            Slovenia
                          </option>
                          <option data-code="SB" value="Solomon Islands">
                            Solomon Islands
                          </option>
                          <option data-code="SO" value="Somalia">
                            Somalia
                          </option>
                          <option data-code="ZA" value="South Africa">
                            South Africa
                          </option>
                          <option
                            data-code="GS"
                            value="South Georgia and the South Sandwich Islands"
                          >
                            South Georgia and the South Sandwich Islands
                          </option>
                          <option data-code="SS" value="South Sudan">
                            South Sudan
                          </option>
                          <option data-code="ES" value="Spain">
                            Spain
                          </option>
                          <option data-code="LK" value="Sri Lanka">
                            Sri Lanka
                          </option>
                          <option data-code="SD" value="Sudan">
                            Sudan
                          </option>
                          <option data-code="SR" value="Suriname">
                            Suriname
                          </option>
                          <option data-code="SJ" value="Svalbard and Jan Mayen">
                            Svalbard and Jan Mayen
                          </option>
                          <option data-code="SZ" value="Swaziland">
                            Swaziland
                          </option>
                          <option data-code="SE" value="Sweden">
                            Sweden
                          </option>
                          <option data-code="CH" value="Switzerland">
                            Switzerland
                          </option>
                          <option data-code="SY" value="Syrian Arab Republic">
                            Syrian Arab Republic
                          </option>
                          <option data-code="TW" value="Taiwan Region">
                            Taiwan Region
                          </option>
                          <option data-code="TJ" value="Tajikistan">
                            Tajikistan
                          </option>
                          <option
                            data-code="TZ"
                            value="Tanzania, United Republic of"
                          >
                            Tanzania, United Republic of
                          </option>
                          <option data-code="TH" value="Thailand">
                            Thailand
                          </option>
                          <option data-code="TL" value="Timor-Leste">
                            Timor-Leste
                          </option>
                          <option data-code="TG" value="Togo">
                            Togo
                          </option>
                          <option data-code="TK" value="Tokelau">
                            Tokelau
                          </option>
                          <option data-code="TO" value="Tonga">
                            Tonga
                          </option>
                          <option data-code="TT" value="Trinidad and Tobago">
                            Trinidad and Tobago
                          </option>
                          <option data-code="TN" value="Tunisia">
                            Tunisia
                          </option>
                          <option data-code="TR" value="Turkey">
                            Turkey
                          </option>
                          <option data-code="TM" value="Turkmenistan">
                            Turkmenistan
                          </option>
                          <option
                            data-code="TC"
                            value="Turks and Caicos Islands"
                          >
                            Turks and Caicos Islands
                          </option>
                          <option data-code="TV" value="Tuvalu">
                            Tuvalu
                          </option>
                          <option data-code="UG" value="Uganda">
                            Uganda
                          </option>
                          <option data-code="UA" value="Ukraine">
                            Ukraine
                          </option>
                          <option data-code="AE" value="United Arab Emirates">
                            United Arab Emirates
                          </option>
                          <option data-code="GB" value="United Kingdom">
                            United Kingdom
                          </option>
                          <option
                            data-code="UM"
                            value="United States Minor Outlying Islands"
                          >
                            United States Minor Outlying Islands
                          </option>
                          <option data-code="UY" value="Uruguay">
                            Uruguay
                          </option>
                          <option data-code="UZ" value="Uzbekistan">
                            Uzbekistan
                          </option>
                          <option data-code="VU" value="Vanuatu">
                            Vanuatu
                          </option>
                          <option data-code="VE" value="Venezuela">
                            Venezuela
                          </option>
                          <option data-code="VN" value="Vietnam">
                            Vietnam
                          </option>
                          <option
                            data-code="VG"
                            value="Virgin Islands, British"
                          >
                            Virgin Islands, British
                          </option>
                          <option data-code="VI" value="Virgin Islands, U.S.">
                            Virgin Islands, U.S.
                          </option>
                          <option data-code="WF" value="Wallis and Futuna">
                            Wallis and Futuna
                          </option>
                          <option data-code="EH" value="Western Sahara">
                            Western Sahara
                          </option>
                          <option data-code="YE" value="Yemen">
                            Yemen
                          </option>
                          <option data-code="ZM" value="Zambia">
                            Zambia
                          </option>
                          <option data-code="ZW" value="Zimbabwe">
                            Zimbabwe
                          </option>
                        </select>
                        <input
                          {...register('city')}
                          className="rounded-sm border px-2 py-1 text-sm placeholder:text-sm hover:border-gray-700 focus:border-blue-600 focus:outline-none"
                          type="text"
                          disabled={errors.country?.message?.length! > 0}
                          value={errors.country && ''}
                          placeholder="도시"
                          list="city"
                        />
                        {errors.country && (
                          <ErrorMessage text={errors.country.message} />
                        )}
                        {errors.city && (
                          <ErrorMessage text={errors.city.message} />
                        )}
                        <datalist id="city">
                          {cityData &&
                            cityData.map((item: StatesProps) => (
                              <option
                                key={item.code}
                                value={item.name}
                              ></option>
                            ))}
                        </datalist>
                      </div>
                    </div>
                    <Input
                      register={register('URL', {
                        maxLength: {
                          value: 100,
                          message: '너무 깁니다.',
                        },
                      })}
                      name="URL"
                      label="웹 사이트 URL"
                      type="text"
                      maxLength={100}
                    ></Input>
                    {errors.URL && <ErrorMessage text={errors.URL.message} />}
                  </div>
                </div>
              </div>

              <div className="mt-6 border bg-white p-8">
                <div className="pb-4">
                  <span className="text-sm font-semibold">ABOUT ME</span>
                </div>
                <TextArea
                  register={register('introduce', {
                    maxLength: {
                      value: 800,
                      message: '800자 이하만 작성할 수 있습니다.',
                    },
                  })}
                  label="설명"
                  name="info"
                  type="text"
                  maxLength={800}
                ></TextArea>
                {errors.introduce && (
                  <ErrorMessage text={errors.introduce.message} />
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-4 border bg-white p-6">
              <h6 className="text-sm font-semibold">웹</h6>
              <ProfileWeb
                setValue={() => setValue('Facebook', '')}
                register={register('Facebook')}
                label={user?.Facebook}
                name="Facebook"
                watchData={facebookWD}
                logo="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"
              />
              <ProfileWeb
                setValue={() => setValue('Youtube', '')}
                register={register('Youtube')}
                label={user?.Youtube}
                watchData={youtubeWD}
                name="Youtube"
                logo="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"
              />
              <ProfileWeb
                setValue={() => setValue('Github', '')}
                register={register('Github')}
                watchData={githubWD}
                label={user?.Github}
                name="Github"
                logo="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
              <ProfileWeb
                setValue={() => setValue('Twitter', '')}
                register={register('Twitter')}
                watchData={twitterWD}
                label={user?.Twitter}
                name="Twitter"
                logo="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"
              />
              <ProfileWeb
                setValue={() => setValue('Instagram', '')}
                register={register('Instagram')}
                watchData={instagramWD}
                label={user?.Instagram}
                name="Instagram"
                logo="M14.829 6.302c-.738-.034-.96-.04-2.829-.04s-2.09.007-2.828.04c-1.899.087-2.783.986-2.87 2.87-.033.738-.041.959-.041 2.828s.008 2.09.041 2.829c.087 1.879.967 2.783 2.87 2.87.737.033.959.041 2.828.041 1.87 0 2.091-.007 2.829-.041 1.899-.086 2.782-.988 2.87-2.87.033-.738.04-.96.04-2.829s-.007-2.09-.04-2.828c-.088-1.883-.973-2.783-2.87-2.87zm-2.829 9.293c-1.985 0-3.595-1.609-3.595-3.595 0-1.985 1.61-3.594 3.595-3.594s3.595 1.609 3.595 3.594c0 1.985-1.61 3.595-3.595 3.595zm3.737-6.491c-.464 0-.84-.376-.84-.84 0-.464.376-.84.84-.84.464 0 .84.376.84.84 0 .463-.376.84-.84.84zm-1.404 2.896c0 1.289-1.045 2.333-2.333 2.333s-2.333-1.044-2.333-2.333c0-1.289 1.045-2.333 2.333-2.333s2.333 1.044 2.333 2.333zm-2.333-12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.958 14.886c-.115 2.545-1.532 3.955-4.071 4.072-.747.034-.986.042-2.887.042s-2.139-.008-2.886-.042c-2.544-.117-3.955-1.529-4.072-4.072-.034-.746-.042-.985-.042-2.886 0-1.901.008-2.139.042-2.886.117-2.544 1.529-3.955 4.072-4.071.747-.035.985-.043 2.886-.043s2.14.008 2.887.043c2.545.117 3.957 1.532 4.071 4.071.034.747.042.985.042 2.886 0 1.901-.008 2.14-.042 2.886z"
              />
              <ProfileWeb
                setValue={() => setValue('LinkedIn', '')}
                register={register('LinkedIn')}
                watchData={linkedInWD}
                label={user?.LinkedIn}
                name="LinkedIn"
                logo="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"
              />
              <ProfileWeb
                setValue={() => setValue('Twitch', '')}
                register={register('Twitch')}
                watchData={twitchWD}
                label={user?.Twitch}
                name="Twitch"
                logo="M10.224 17.806l1.776-1.776h3.343l2.09-2.09v-6.686h-10.03v8.776h2.821v1.776zm3.866-8.149h1.254v3.653h-1.254v-3.653zm-3.344 0h1.254v3.653h-1.254v-3.653zm1.254-9.657c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.687 14.567l-3.657 3.657h-2.716l-1.777 1.776h-1.88v-1.776h-3.344v-9.821l.941-2.403h12.433v8.567z"
              />
              <ProfileWeb
                setValue={() => setValue('Dribble', '')}
                watchData={dribbleWD}
                register={register('Dribble')}
                label={user?.Dribble}
                name="Dribble"
                logo="M11.455 9.985c-1.419.417-3.11.632-5.067.646.405-1.654 1.518-3.03 3.003-3.784.777 1.016 1.464 2.063 2.064 3.138zm.965 1.93c-.124-.28-.254-.559-.391-.835-1.622.51-3.561.769-5.804.772l-.008.148c0 1.404.504 2.692 1.34 3.695 1.266-1.901 2.891-3.164 4.863-3.78zm-3.97 4.641c1.569 1.225 3.671 1.589 5.624.836-.252-1.488-.65-2.94-1.19-4.352-1.819.542-3.285 1.714-4.434 3.516zm7.075-9.13c-.977-.754-2.197-1.209-3.525-1.209-.49 0-.964.068-1.418.184.764 1.028 1.441 2.086 2.035 3.172 1.236-.524 2.204-1.24 2.908-2.147zm8.475 4.574c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-5 0c0-3.866-3.135-7-7-7s-7 3.134-7 7 3.135 7 7 7 7-3.134 7-7zm-5.824-1.349c.157.324.305.651.447.98 1.26-.217 2.641-.204 4.143.042-.073-1.292-.566-2.474-1.354-3.403-.807 1.005-1.89 1.798-3.236 2.381zm.914 2.132c.489 1.309.865 2.651 1.119 4.023 1.312-.88 2.241-2.284 2.497-3.909-1.317-.228-2.522-.268-3.616-.114z"
              />
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default ProfileEditor;

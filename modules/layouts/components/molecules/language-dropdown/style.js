import styled from 'styled-components';
// import { Avatar } from 'antd';

export const LanguageDropdownWrapper = styled.div`
  position: relative;
  width: 44px;
  height: 28px;
  align-self: center;

  .wf-design-left-editable-select2-field .select2-chosen {
    margin-right: 15px !important;
  }
  .skiptranslate iframe {
    visibility: hidden !important;
    opacity: 0;
    display: none;
    position: absolute !important;
    top: 0 !important;
    height: 0 !important;
  }
  .VIpgJd-ZVi9od-ORHb-OEVmcd,
  .VIpgJd-ZVi9od-aZ2wEe-wOHMyf {
    display: none;
  }
  #google_translate_element {
    width: 44px !important;
    position: relative;
  }
  #google_translate_element .skiptranslate.goog-te-gadget {
    top: 0px !important;
    height: 28px;
    overflow: hidden;
    position: relative;
    color: transparent;
  }
  #google_translate_element .skiptranslate.goog-te-gadget > span {
    display: none !important;
  }
  #google_translate_element .skiptranslate.goog-te-gadget .goog-te-combo {
    background: #f0f5ff;
    width: 100%;
    max-width: 44px;
    overflow: hidden !important;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 28px;
    margin: 0 !important;
    cursor: pointer;
    border-color: #f0f5ff;
    border-radius: 6px;
    color: #222;
    top: 0;
    position: absolute;
    opacity: 0;
    left: 0;
    z-index: 1000;
  }
  #google_translate_element
    .skiptranslate.goog-te-gadget
    .goog-te-combo:focus-visible {
    outline: 0;
  }
  #google_translate_element
    .skiptranslate.goog-te-gadget
    .goog-te-combo::-webkit-scrollbar {
    width: 10px;
    background: #000;
  }
  #google_translate_element
    .skiptranslate.goog-te-gadget
    .goog-te-combo::-webkit-scrollbar-track {
    background: #f2f2f2 !important;
  }
  #google_translate_element
    .skiptranslate.goog-te-gadget
    .goog-te-combo::-webkit-scrollbar-thumb {
    background: black !important;
    border-radius: 12px;
  }
  #google_translate_element
    .skiptranslate.goog-te-gadget
    .goog-te-combo::-webkit-scrollbar-thumb:hover {
    background: #c6c6c6;
  }
  span.tranIcin {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 28px;
    line-height: normal;
    padding: 5px 0;
    text-align: center;
    background: #f0f5ff;
    border-radius: 6px;
    z-index: 999;
    display: flex;
    justify-content: space-around;
  }
  #google_translate_element
    .skiptranslate.goog-te-gadget
    .goog-te-combo
    option[value=''] {
    display: none;
  }
  .skiptranslate iframe {
    visibility: hidden !important;
    display: none;
  }
  .VIpgJd-ZVi9od-ORHb-OEVmcd,
  .VIpgJd-ZVi9od-aZ2wEe-wOHMyf {
    display: none;
  }
`;

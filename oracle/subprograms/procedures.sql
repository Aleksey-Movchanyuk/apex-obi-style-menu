create or replace package body ODS$GUI_PKG is
 
  -- Функція генерує HTML код для меню переходу до інших програм
  function Get_Main_Bar_Product_Menu_F return varchar2 is
 
    v_HTML_Code varchar2(10000);
 
    cursor c_Apps is
       select apps.appl_name, apps.appl_html_name, apps.appl_url, apps.appl_is_separator
       from application_list apps
       order by apps.appl_order;
 
  begin
 
    -- Ініциалізуємо змінні
 
    -- Генеруемо заголовок меню
    v_HTML_Code := v_HTML_Code || '<table cellspacing="0px" class="menuShadowWrapper">';
    v_HTML_Code := v_HTML_Code || '   <tr>';
    v_HTML_Code := v_HTML_Code || '       <td class="shadowMenuCell" colspan="2" rowspan="2">';
 
    -- Додаемо ссилки на інші програми
    FOR a IN c_Apps LOOP
      IF a.appl_is_separator = 'Y' THEN
        v_HTML_Code := v_HTML_Code || '          <div class="NQWMenuItemSeparator"></div>';
      ELSE
        v_HTML_Code := v_HTML_Code || '          <a href="' || a.appl_url || '" target="_blank" name="' || a.appl_html_name || '" class="NQWMenuItem"> ' || a.appl_name || ' </a>';
      END IF;
 
    END LOOP;
    -- Генеруемо кінець заголовку меню
    v_HTML_Code := v_HTML_Code || '      </td>';
    v_HTML_Code := v_HTML_Code || '      <td class="shadowOffsetCellRight"></td>';
    v_HTML_Code := v_HTML_Code || '   </tr>';
    v_HTML_Code := v_HTML_Code || '  <tr>';
    v_HTML_Code := v_HTML_Code || '     <td class="shadowRight"></td>';
    v_HTML_Code := v_HTML_Code || '  </tr>';
    v_HTML_Code := v_HTML_Code || '  <tr>';
    v_HTML_Code := v_HTML_Code || '     <td class="shadowOffsetCellBottom"></td>';
    v_HTML_Code := v_HTML_Code || '     <td class="shadowBottom"></td>';
    v_HTML_Code := v_HTML_Code || '     <td class="shadowCorner"></td>';
    v_HTML_Code := v_HTML_Code || '  </tr>';
    v_HTML_Code := v_HTML_Code || '</table>';
 
    return v_HTML_Code;
  end;
 
end ODS$GUI_PKG;
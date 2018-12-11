function [val] = myHash(input_string)
    out_string = mlreportgen.utils.hash(input_string);
    hex_string = dec2hex(char(out_string));
    whole_hex_string = "";
    for i = 2:4
        whole_hex_string = strcat(whole_hex_string, hex_string(i, :));
    end
    val = str2double(whole_hex_string);
end
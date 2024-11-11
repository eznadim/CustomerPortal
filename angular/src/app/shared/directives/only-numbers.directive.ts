import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: '[onlyNumbers]'
})
export class OnlyNumbersDirective {
    @HostListener('input', ['$event'])
    onInput(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9]/g, '');
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const input = event.target as HTMLInputElement;
        const pastedInput = event.clipboardData?.getData('text/plain');
        if (pastedInput) {
            input.value = pastedInput.replace(/[^0-9]/g, '');
        }
    }
}
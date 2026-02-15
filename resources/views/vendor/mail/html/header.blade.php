@props(['url'])
<tr>
    <td class="header">
        <a href="{{ config('app.url') }}" style="display: inline-block;">
            <img src="{{ Vite::asset('resources/js/assets/giz-logo.svg') }}" alt="{{ config('app.name') }}"
                style="max-height:60px;">
        </a>
    </td>
</tr>
